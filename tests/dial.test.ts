import { describe, expect, test } from "bun:test";
import {
  BASELINE_MODEL_ID,
  VENDOR_SAVINGS_NOTE,
  buildFakeModelPricing,
  dial,
  formatDial,
} from "../src/dial";
import { DEFAULT_ROUTING_CONFIG } from "@blockrun/clawrouter/router";

describe("fake modelPricing Map", () => {
  test("includes baseline Opus and every tier primary", () => {
    const map = buildFakeModelPricing();
    expect(map.has(BASELINE_MODEL_ID)).toBe(true);
    for (const tier of Object.values(DEFAULT_ROUTING_CONFIG.tiers)) {
      expect(map.has(tier.primary)).toBe(true);
    }
  });

  test("prices are finite numbers", () => {
    for (const [id, p] of buildFakeModelPricing()) {
      expect(Number.isFinite(p.inputPrice)).toBe(true);
      expect(Number.isFinite(p.outputPrice)).toBe(true);
      expect(id.length).toBeGreaterThan(0);
    }
  });
});

describe("dial() — real local route(), no network", () => {
  test("eco profile returns a concrete model id", () => {
    const result = dial({
      prompt: "Say hello in one short sentence.",
      routingProfile: "eco",
      maxOutputTokens: 128,
    });
    expect(result.model.includes("/")).toBe(true);
    expect(result.tier.length).toBeGreaterThan(0);
    expect(result.profile).toBe("eco");
    expect(result.vendorSavingsNote).toBe(VENDOR_SAVINGS_NOTE);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  test("reasoning-ish prompt still routes without network", () => {
    const result = dial({
      prompt: "Prove that sqrt(2) is irrational step by step.",
      routingProfile: "auto",
      maxOutputTokens: 2048,
    });
    expect(result.model.length).toBeGreaterThan(0);
    expect(result.method.length).toBeGreaterThan(0);
    expect(result.baselineCost).toBeGreaterThanOrEqual(0);
  });

  test("premium profile keeps savings at 0 (quality path)", () => {
    const result = dial({
      prompt: "Summarize yesterday's standup in two bullets.",
      routingProfile: "premium",
      maxOutputTokens: 256,
    });
    expect(result.profile).toBe("premium");
    expect(result.savings).toBe(0);
  });

  test("formatDial includes vendor hedge, not a lab-owned 84% claim", () => {
    const result = dial({
      prompt: "list three fruit names",
      routingProfile: "eco",
    });
    const text = formatDial(result);
    expect(text).toContain(result.model);
    expect(text).toContain(VENDOR_SAVINGS_NOTE);
    expect(text).not.toMatch(/\bour measurement\b/i);
  });

  test("accepts an injected fake pricing map", () => {
    const custom = buildFakeModelPricing();
    custom.set("google/gemini-2.5-flash", {
      inputPrice: 0.01,
      outputPrice: 0.02,
    });
    const result = dial({
      prompt: "hi",
      routingProfile: "eco",
      modelPricing: custom,
      maxOutputTokens: 64,
    });
    expect(result.model.length).toBeGreaterThan(0);
  });
});
