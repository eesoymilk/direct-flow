import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createEmptyPerson, createEmptyShareholder } from "~/utils/formHelpers";

describe("Form Helpers", () => {
  describe("createEmptyPerson", () => {
    it("should create a person with default dateOfBirth set to 18 years ago", () => {
      const person = createEmptyPerson();

      expect(person.dateOfBirth).toBeDefined();
      expect(person.dateOfBirth).toBeInstanceOf(Date);

      // Calculate expected age (should be 18 years)
      const today = new Date();
      const birthDate = person.dateOfBirth!;
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Account for whether birthday has occurred this year
      const actualAge =
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      expect(actualAge).toBe(18);
    });

    it("should create a person with empty string fields", () => {
      const person = createEmptyPerson();

      expect(person.name).toBe("");
      expect(person.idNumber).toBe("");
      expect(person.address).toBe("");
      expect(person.email).toBe("");
    });
  });

  describe("createEmptyShareholder", () => {
    it("should create a shareholder with default dateOfBirth set to 18 years ago", () => {
      const shareholder = createEmptyShareholder();

      expect(shareholder.dateOfBirth).toBeDefined();
      expect(shareholder.dateOfBirth).toBeInstanceOf(Date);

      // Calculate expected age (should be 18 years)
      const today = new Date();
      const birthDate = shareholder.dateOfBirth;
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Account for whether birthday has occurred this year
      const actualAge =
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      expect(actualAge).toBe(18);
    });

    it("should create a shareholder with proper default values", () => {
      const shareholder = createEmptyShareholder();

      expect(shareholder.name).toBe("");
      expect(shareholder.idNumber).toBe("");
      expect(shareholder.address).toBe("");
      expect(shareholder.isReadonly).toBe(false);
      expect(shareholder.shares).toBeDefined();
      expect(shareholder.shares.ordinary).toEqual({
        quantity: 0,
        pricePerShare: 0,
        totalPrice: 0,
      });
    });
  });

  describe("Age calculation edge cases", () => {
    it("should set birth year to 18 years before current year", () => {
      const person = createEmptyPerson();
      const currentYear = new Date().getFullYear();
      const expectedBirthYear = currentYear - 18;

      expect(person.dateOfBirth!.getFullYear()).toBe(expectedBirthYear);
    });

    it("should create consistent dates for multiple calls", () => {
      const person1 = createEmptyPerson();
      const person2 = createEmptyPerson();

      // Should be the same date (within a reasonable time difference)
      const timeDifference = Math.abs(
        person1.dateOfBirth!.getTime() - person2.dateOfBirth!.getTime()
      );

      // Should be created within 1 second of each other
      expect(timeDifference).toBeLessThan(1000);
    });
  });
});
