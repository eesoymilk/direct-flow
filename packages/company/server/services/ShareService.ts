/**
 * Share Service - Centralized business logic for share operations
 * Handles all share-related database operations and business rules
 */

import {
  shareTypes,
  applicationShareHoldings,
  companyApplications,
  applicationShareholders,
} from '../database/schema/index';
import { eq, and, sum, desc } from 'drizzle-orm';
import { SHARE_TYPES, SHARE_TYPE_NAMES } from '../../shared/utils/constants';

export class ShareService {
  constructor(private db: DrizzleClient) {}

  // Share Types Management
  async getShareTypes() {
    return await this.db.query.shareTypes.findMany({
      orderBy: [shareTypes.id],
    });
  }

  async initializeShareTypes() {
    const existingTypes = await this.getShareTypes();
    
    if (existingTypes.length === 0) {
      const shareTypeData = SHARE_TYPES.map((code) => ({
        code,
        name: SHARE_TYPE_NAMES[code],
        isPreferred: code !== 'ordinary',
      }));

      await this.db.insert(shareTypes).values(shareTypeData);
      return shareTypeData;
    }

    return existingTypes;
  }

  // Share Holdings CRUD
  async createShareHolding(data: {
    applicationId: string;
    shareholderId: string;
    shareTypeCode: string;
    quantity: number;
    pricePerShare: number;
  }) {
    // Get share type ID
    const shareType = await this.db.query.shareTypes.findFirst({
      where: eq(shareTypes.code, data.shareTypeCode),
    });

    if (!shareType) {
      throw new Error(`Invalid share type: ${data.shareTypeCode}`);
    }

    // Calculate total amount
    const totalAmount = (data.quantity * data.pricePerShare).toFixed(2);

    const [holding] = await this.db
      .insert(applicationShareHoldings)
      .values({
        applicationId: data.applicationId,
        shareholderId: data.shareholderId,
        shareTypeId: shareType.id,
        quantity: data.quantity,
        pricePerShare: data.pricePerShare.toFixed(2),
        totalAmount,
      })
      .returning();

    // Update application totals
    await this.updateApplicationShareTotals(data.applicationId);

    return this.getShareHoldingWithDetails(holding.id);
  }

  async updateShareHolding(
    id: string, 
    updates: Partial<{
      quantity: number;
      pricePerShare: number;
      shareTypeCode: string;
    }>
  ) {
    const existing = await this.db.query.applicationShareHoldings.findFirst({
      where: eq(applicationShareHoldings.id, id),
    });

    if (!existing) {
      throw new Error('Share holding not found');
    }

    const updateData: any = {};

    // Handle share type change
    if (updates.shareTypeCode) {
      const shareType = await this.db.query.shareTypes.findFirst({
        where: eq(shareTypes.code, updates.shareTypeCode),
      });
      if (!shareType) {
        throw new Error(`Invalid share type: ${updates.shareTypeCode}`);
      }
      updateData.shareTypeId = shareType.id;
    }

    // Handle quantity/price updates
    if (updates.quantity !== undefined) {
      updateData.quantity = updates.quantity;
    }
    if (updates.pricePerShare !== undefined) {
      updateData.pricePerShare = updates.pricePerShare.toFixed(2);
    }

    // Recalculate total if quantity or price changed
    if (updates.quantity !== undefined || updates.pricePerShare !== undefined) {
      const quantity = updates.quantity ?? existing.quantity;
      const pricePerShare = updates.pricePerShare ?? parseFloat(existing.pricePerShare || '0');
      updateData.totalAmount = (quantity * pricePerShare).toFixed(2);
    }

    const [updated] = await this.db
      .update(applicationShareHoldings)
      .set(updateData)
      .where(eq(applicationShareHoldings.id, id))
      .returning();

    // Update application totals
    await this.updateApplicationShareTotals(existing.applicationId);

    return this.getShareHoldingWithDetails(updated.id);
  }

  async deleteShareHolding(id: string) {
    const existing = await this.db.query.applicationShareHoldings.findFirst({
      where: eq(applicationShareHoldings.id, id),
    });

    if (!existing) {
      throw new Error('Share holding not found');
    }

    await this.db
      .delete(applicationShareHoldings)
      .where(eq(applicationShareHoldings.id, id));

    // Update application totals
    await this.updateApplicationShareTotals(existing.applicationId);

    return { success: true };
  }

  async getShareHoldingWithDetails(id: string) {
    return await this.db.query.applicationShareHoldings.findFirst({
      where: eq(applicationShareHoldings.id, id),
      with: {
        shareType: true,
        shareholder: {
          with: {
            person: true,
          },
        },
      },
    });
  }

  async getShareholderHoldings(shareholderId: string) {
    return await this.db.query.applicationShareHoldings.findMany({
      where: eq(applicationShareHoldings.shareholderId, shareholderId),
      with: {
        shareType: true,
      },
      orderBy: [applicationShareHoldings.createdAt],
    });
  }

  async getApplicationShareHoldings(applicationId: string) {
    return await this.db.query.applicationShareHoldings.findMany({
      where: eq(applicationShareHoldings.applicationId, applicationId),
      with: {
        shareType: true,
        shareholder: {
          with: {
            person: true,
          },
        },
      },
      orderBy: [applicationShareHoldings.createdAt],
    });
  }

  // Application Share Totals
  async calculateApplicationShareTotals(applicationId: string) {
    const holdings = await this.getApplicationShareHoldings(applicationId);

    let ordinaryTotal = 0;
    let preferredTotal = 0;

    for (const holding of holdings) {
      const amount = parseFloat(holding.totalAmount || '0');
      if (holding.shareType?.isPreferred) {
        preferredTotal += amount;
      } else {
        ordinaryTotal += amount;
      }
    }

    return {
      ordinarySharesAmount: ordinaryTotal,
      preferredSharesAmount: preferredTotal,
      totalAmount: ordinaryTotal + preferredTotal,
    };
  }

  async updateApplicationShareTotals(applicationId: string) {
    const totals = await this.calculateApplicationShareTotals(applicationId);

    await this.db
      .update(companyApplications)
      .set({
        ordinarySharesAmount: totals.ordinarySharesAmount,
        preferredSharesAmount: totals.preferredSharesAmount,
      })
      .where(eq(companyApplications.id, applicationId));

    return totals;
  }

  // Validation and Business Rules
  async validateApplicationShares(applicationId: string) {
    const shareholders = await this.db.query.applicationShareholders.findMany({
      where: eq(applicationShareholders.applicationId, applicationId),
      with: { person: true },
    });

    const holdings = await this.getApplicationShareHoldings(applicationId);

    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (shareholders.length === 0) {
      errors.push('至少需要一位股東');
    }

    if (holdings.length === 0) {
      errors.push('至少需要一筆持股記錄');
    }

    // Check for shareholders without holdings
    const shareholdersWithoutHoldings = shareholders.filter(
      shareholder => !holdings.some(holding => holding.shareholderId === shareholder.id)
    );

    if (shareholdersWithoutHoldings.length > 0) {
      errors.push(`${shareholdersWithoutHoldings.length} 位股東尚未設定持股`);
    }

    // Business rule validations
    const totals = await this.calculateApplicationShareTotals(applicationId);
    
    if (totals.totalAmount === 0) {
      errors.push('總投資金額不能為零');
    }

    // Check for duplicate share types per shareholder
    const shareholderHoldings = new Map<string, Set<string>>();
    for (const holding of holdings) {
      if (!shareholderHoldings.has(holding.shareholderId)) {
        shareholderHoldings.set(holding.shareholderId, new Set());
      }
      const shareTypes = shareholderHoldings.get(holding.shareholderId)!;
      if (shareTypes.has(holding.shareType!.code)) {
        errors.push('同一股東不能持有重複的股票類型');
        break;
      }
      shareTypes.add(holding.shareType!.code);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totals,
    };
  }

  // Analytics and Reporting
  async getShareTypeBreakdown(applicationId: string) {
    const holdings = await this.getApplicationShareHoldings(applicationId);

    const breakdown = new Map<string, {
      shareType: string;
      typeName: string;
      totalQuantity: number;
      totalAmount: number;
      shareholderCount: number;
      avgPricePerShare: number;
    }>();

    holdings.forEach(holding => {
      const key = holding.shareType!.code;
      const existing = breakdown.get(key) || {
        shareType: key,
        typeName: holding.shareType!.name,
        totalQuantity: 0,
        totalAmount: 0,
        shareholderCount: 0,
        avgPricePerShare: 0,
      };

      existing.totalQuantity += holding.quantity;
      existing.totalAmount += parseFloat(holding.totalAmount || '0');
      
      breakdown.set(key, existing);
    });

    // Calculate unique shareholder count and average price per type
    for (const [key, data] of breakdown) {
      const typeHoldings = holdings.filter(h => h.shareType!.code === key);
      const uniqueShareholders = new Set(typeHoldings.map(h => h.shareholderId));
      data.shareholderCount = uniqueShareholders.size;
      data.avgPricePerShare = data.totalQuantity > 0 
        ? data.totalAmount / data.totalQuantity 
        : 0;
    }

    return Array.from(breakdown.values());
  }

  async getShareholderSummaries(applicationId: string) {
    const shareholders = await this.db.query.applicationShareholders.findMany({
      where: eq(applicationShareholders.applicationId, applicationId),
      with: { person: true },
    });

    const holdings = await this.getApplicationShareHoldings(applicationId);
    const appTotals = await this.calculateApplicationShareTotals(applicationId);

    return shareholders.map(shareholder => {
      const shareholderHoldings = holdings.filter(
        holding => holding.shareholderId === shareholder.id
      );

      const totalInvestment = shareholderHoldings.reduce(
        (sum, holding) => sum + parseFloat(holding.totalAmount || '0'), 0
      );

      const ownershipPercentage = appTotals.totalAmount > 0 
        ? (totalInvestment / appTotals.totalAmount) * 100 
        : 0;

      return {
        shareholder,
        holdings: shareholderHoldings,
        totalInvestment,
        ownershipPercentage,
        holdingTypes: shareholderHoldings.map(h => h.shareType!.name),
      };
    });
  }
}

// Utility function to create service instance
export const createShareService = (db: DrizzleClient) => {
  return new ShareService(db);
};