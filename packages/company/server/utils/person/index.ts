import { people } from "../../database";
import type { CalendarDate } from "@internationalized/date";

// Helper to convert CalendarDate to database string format
const convertDateOfBirth = (dateOfBirth?: CalendarDate) => {
  if (!dateOfBirth) return null;
  return `${dateOfBirth.year}-${String(dateOfBirth.month).padStart(2, "0")}-${String(dateOfBirth.day).padStart(2, "0")}`;
};

export const createPerson = async (
  db: DrizzleClient | DrizzleTransaction,
  personData: any // Using any to handle the CalendarDate conversion
) => {
  // Convert CalendarDate to string for database storage
  const dbPersonData = {
    ...personData,
    dateOfBirth: convertDateOfBirth(personData.dateOfBirth),
  };

  const [result] = await db.insert(people).values(dbPersonData).returning();
  return result;
};
