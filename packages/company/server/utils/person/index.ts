import { people } from "../../database";

// Helper to convert Date to database string format
const convertDateOfBirth = (dateOfBirth?: Date) => {
  if (!dateOfBirth) return null;
  return dateOfBirth.toISOString().split("T")[0];
};

export const createPerson = async (
  db: DrizzleClient | DrizzleTransaction,
  personData: PersonSchema // Using PersonSchema for type safety
) => {
  // Convert CalendarDate to string for database storage
  const dbPersonData = {
    ...personData,
    dateOfBirth: convertDateOfBirth(personData.dateOfBirth),
  };

  const [result] = await db.insert(people).values(dbPersonData).returning();
  if (!result) {
    throw new Error("Failed to create person");
  }
  return result;
};
