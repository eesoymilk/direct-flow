// Seed script to initialize share types
import { shareTypes } from "./schema/index";
import { SHARE_TYPES, SHARE_TYPE_NAMES } from "../../shared/utils/constants";

export const seedShareTypes = async (db: DrizzleClient) => {
  console.log("🌱 Seeding share types...");
  
  try {
    // Check if share types already exist
    const existingTypes = await db.select().from(shareTypes);
    
    if (existingTypes.length > 0) {
      console.log("✅ Share types already exist, skipping seed");
      return;
    }

    // Create share types
    const shareTypeData = SHARE_TYPES.map((code) => ({
      code,
      name: SHARE_TYPE_NAMES[code],
      isPreferred: code !== "ordinary", // Only ordinary shares are not preferred
    }));

    await db.insert(shareTypes).values(shareTypeData);
    
    console.log(`✅ Seeded ${shareTypeData.length} share types:`);
    shareTypeData.forEach(st => {
      console.log(`   - ${st.code}: ${st.name} (${st.isPreferred ? 'Preferred' : 'Ordinary'})`);
    });
    
  } catch (error) {
    console.error("❌ Failed to seed share types:", error);
    throw error;
  }
};