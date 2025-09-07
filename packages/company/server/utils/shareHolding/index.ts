import {
  shareTypes,
  applicationShareHoldings,
} from "../../database/schema/index";
import { SHARE_TYPES, SHARE_TYPE_NAMES } from "../../../shared/utils/constants";
import { eq } from "drizzle-orm";

// Initialize share types in database if they don't exist
export const initializeShareTypes = async (db: DrizzleClient) => {
  const existingTypes = await db.select().from(shareTypes);
  
  if (existingTypes.length === 0) {
    const shareTypeData = SHARE_TYPES.map((code) => ({
      code,
      name: SHARE_TYPE_NAMES[code],
      isPreferred: code !== "ordinary",
    }));
    
    await db.insert(shareTypes).values(shareTypeData);
  }
};

// Create share holdings for a shareholder
export const createShareHoldings = async (
  db: DrizzleClient | DrizzleTransaction,
  applicationId: string,
  shareholderId: string,
  holdings: {
    shareType: string;
    quantity: number;
    pricePerShare: number;
  }[]
) => {
  if (holdings.length === 0) return [];

  // Get share type IDs
  const shareTypeMap = await db.query.shareTypes.findMany();
  const typeIdMap = new Map(shareTypeMap.map(st => [st.code, st.id]));

  const holdingData = holdings.map(holding => ({
    applicationId,
    shareholderId,
    shareTypeId: typeIdMap.get(holding.shareType),
    quantity: holding.quantity,
    pricePerShare: holding.pricePerShare.toString(), // Convert to string for decimal
    totalAmount: (holding.quantity * holding.pricePerShare).toString(),
  })).filter(h => h.shareTypeId); // Filter out invalid share types

  if (holdingData.length === 0) return [];

  return await db.insert(applicationShareHoldings).values(holdingData).returning();
};

// Calculate total ordinary and preferred share amounts for an application
export const calculateApplicationShareTotals = async (
  db: DrizzleClient,
  applicationId: string
) => {
  const totals = await db.query.applicationShareHoldings.findMany({
    where: eq(applicationShareHoldings.applicationId, applicationId),
    with: {
      shareType: true,
    },
  });

  let ordinaryTotal = 0;
  let preferredTotal = 0;

  for (const holding of totals) {
    const amount = parseFloat(holding.totalAmount || "0");
    if (holding.shareType?.isPreferred) {
      preferredTotal += amount;
    } else {
      ordinaryTotal += amount;
    }
  }

  return {
    ordinarySharesAmount: ordinaryTotal,
    preferredSharesAmount: preferredTotal,
  };
};

// Update application share totals in the database
export const updateApplicationShareTotals = async (
  db: DrizzleClient | DrizzleTransaction,
  applicationId: string
) => {
  const totals = await calculateApplicationShareTotals(db as DrizzleClient, applicationId);
  
  // Note: This would update the companyApplications table
  // await db.update(companyApplications)
  //   .set(totals)
  //   .where(eq(companyApplications.id, applicationId));
  
  return totals;
};

// Delete all share holdings for a shareholder
export const deleteShareHoldings = async (
  db: DrizzleClient | DrizzleTransaction,
  shareholderId: string
) => {
  await db.delete(applicationShareHoldings)
    .where(eq(applicationShareHoldings.shareholderId, shareholderId));
};

// Get share holdings for a specific shareholder
export const getShareHoldingsByShareholder = async (
  db: DrizzleClient,
  shareholderId: string
) => {
  return await db.query.applicationShareHoldings.findMany({
    where: eq(applicationShareHoldings.shareholderId, shareholderId),
    with: {
      shareType: true,
    },
  });
};

// Get all share holdings for an application
export const getShareHoldingsByApplication = async (
  db: DrizzleClient,
  applicationId: string
) => {
  return await db.query.applicationShareHoldings.findMany({
    where: eq(applicationShareHoldings.applicationId, applicationId),
    with: {
      shareholder: {
        with: {
          person: true,
        },
      },
      shareType: true,
    },
  });
};