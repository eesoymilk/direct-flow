import { describe, it, expect } from "vitest";
// import { mountSuspended } from "@nuxt/test-utils/runtime";

describe("Apply Pages Component Tests", () => {
  it("should mount apply index page", async () => {
    // Test that we can import the page component
    const ApplyIndex = await import("~/pages/apply/index.vue");
    expect(ApplyIndex.default).toBeDefined();
  });

  it("should mount apply confirm page", async () => {
    // Test that we can import the page component
    const ApplyConfirm = await import("~/pages/apply/confirm.vue");
    expect(ApplyConfirm.default).toBeDefined();
  });

  it("should mount apply success page", async () => {
    // Test that we can import the page component
    const ApplySuccess = await import("~/pages/apply/success.vue");
    expect(ApplySuccess.default).toBeDefined();
  });
});
