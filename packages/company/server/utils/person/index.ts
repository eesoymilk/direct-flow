import { people } from "../../database";

export const createPerson = async (
  db: DrizzleClient | DrizzleTransaction,
  personData: PersonInsert
) => {
  const [result] = await db.insert(people).values(personData).returning();
  return result;
};
