/**
 * Local ClawRouter dial — uses the REAL route() from @blockrun/clawrouter/router
 * with a fake in-memory modelPricing Map. No proxy, wallet, or network.
 */
import {
  route,
  DEFAULT_ROUTING_CONFIG,
  type ModelPricing,
  type RoutingDecision,
  type RoutingProfile,
} from "@blockrun/clawrouter/router";

/** Baseline Opus id used by router-core for savings math. */
export const BASELINE_MODEL_ID = "anthropic/claude-opus-4.7";

/**
 * Fake USD-per-1M-token prices for tier candidates + baseline.
 * Static fixture only — never fetched, never wallet-backed.
 */
export const FAKE_MODEL_PRICING: ReadonlyArray<readonly [string, ModelPricing]> =
  [
    ["anthropic/claude-opus-4.7", { inputPrice: 5, outputPrice: 25 }],
    ["anthropic/claude-sonnet-4.6", { inputPrice: 3, outputPrice: 15 }],
    ["anthropic/claude-sonnet-5", { inputPrice: 2, outputPrice: 10 }],
    ["deepseek/deepseek-chat", { inputPrice: 0.14, outputPrice: 0.28 }],
    ["deepseek/deepseek-reasoner", { inputPrice: 0.14, outputPrice: 0.28 }],
    ["deepseek/deepseek-v4-pro", { inputPrice: 1.32, outputPrice: 3.96 }],
    ["google/gemini-2.5-flash", { inputPrice: 0.3, outputPrice: 2.5 }],
    ["google/gemini-2.5-flash-lite", { inputPrice: 0.1, outputPrice: 0.4 }],
    ["google/gemini-2.5-pro", { inputPrice: 1.25, outputPrice: 10 }],
    ["google/gemini-3-flash-preview", { inputPrice: 0.5, outputPrice: 3 }],
    ["google/gemini-3.1-flash-lite", { inputPrice: 0.25, outputPrice: 1.5 }],
    ["google/gemini-3.1-pro", { inputPrice: 2, outputPrice: 12 }],
    ["google/gemini-3.5-flash", { inputPrice: 1.5, outputPrice: 9 }],
    ["google/gemini-3.5-flash-lite", { inputPrice: 0.3, outputPrice: 2.5 }],
    ["google/gemini-3.6-flash", { inputPrice: 0.75, outputPrice: 3.75 }],
    ["minimax/minimax-m3", { inputPrice: 0.3, outputPrice: 1.2 }],
    ["moonshot/kimi-k3", { inputPrice: 3, outputPrice: 15 }],
    ["nvidia/nemotron-3.5-lightning", { inputPrice: 0, outputPrice: 0 }],
    ["openai/gpt-5.4", { inputPrice: 2.5, outputPrice: 15 }],
    ["openai/gpt-5.4-nano", { inputPrice: 0.2, outputPrice: 1.25 }],
    ["openai/gpt-5.5", { inputPrice: 5, outputPrice: 30 }],
    ["openai/gpt-5.6-luna", { inputPrice: 0.2, outputPrice: 1.2 }],
    ["openai/gpt-5.6-terra", { inputPrice: 2, outputPrice: 12 }],
    ["openai/o3", { inputPrice: 2, outputPrice: 8 }],
    ["openai/o4-mini", { inputPrice: 1.1, outputPrice: 4.4 }],
    ["qwen/qwen3.7-plus", { inputPrice: 0.32, outputPrice: 1.28 }],
    ["xai/grok-4.3", { inputPrice: 1.25, outputPrice: 2.5 }],
    ["xai/grok-4.5", { inputPrice: 2, outputPrice: 6 }],
    ["zai/glm-5.3", { inputPrice: 1.4, outputPrice: 4.4 }],
    ["zai/glm-5.3-flash", { inputPrice: 0.15, outputPrice: 0.5 }],
  ];

export function buildFakeModelPricing(): Map<string, ModelPricing> {
  return new Map(FAKE_MODEL_PRICING);
}

export type DialOptions = {
  prompt: string;
  systemPrompt?: string;
  maxOutputTokens?: number;
  routingProfile?: RoutingProfile;
  modelPricing?: Map<string, ModelPricing>;
};

export type DialResult = {
  model: string;
  tier: string;
  confidence: number;
  method: string;
  savings: number;
  costEstimate: number;
  baselineCost: number;
  profile: RoutingProfile;
  reasoning: string;
  /** Vendor marketing hedge — not our measurement. */
  vendorSavingsNote: string;
};

export const VENDOR_SAVINGS_NOTE =
  "hasta ~84% vs Opus 5 fijo (mezcla del vendor)";

export function dial(options: DialOptions): DialResult {
  const profile: RoutingProfile = options.routingProfile ?? "eco";
  const modelPricing = options.modelPricing ?? buildFakeModelPricing();
  const maxOutputTokens = options.maxOutputTokens ?? 2048;

  const decision: RoutingDecision = route(
    options.prompt,
    options.systemPrompt,
    maxOutputTokens,
    {
      config: DEFAULT_ROUTING_CONFIG,
      modelPricing,
      routingProfile: profile,
    },
  );

  return {
    model: decision.model,
    tier: decision.tier,
    confidence: decision.confidence,
    method: decision.method,
    savings: decision.savings,
    costEstimate: decision.costEstimate,
    baselineCost: decision.baselineCost,
    profile,
    reasoning: decision.reasoning,
    vendorSavingsNote: VENDOR_SAVINGS_NOTE,
  };
}

export function formatDial(result: DialResult): string {
  const pct = (result.savings * 100).toFixed(1);
  return [
    `model: ${result.model}`,
    `tier: ${result.tier}`,
    `profile: ${result.profile}`,
    `method: ${result.method}`,
    `confidence: ${result.confidence.toFixed(3)}`,
    `costEstimate: $${result.costEstimate.toFixed(6)}`,
    `baselineCost: $${result.baselineCost.toFixed(6)}`,
    `savings (vs baseline in fake pricing): ${pct}%`,
    `vendor note: ${result.vendorSavingsNote}`,
    `reasoning: ${result.reasoning}`,
  ].join("\n");
}

function parseArgs(argv: string[]): DialOptions {
  let routingProfile: RoutingProfile = "eco";
  let maxOutputTokens = 2048;
  const promptParts: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--profile" || a === "-p") {
      const v = (argv[++i] ?? "eco") as RoutingProfile;
      routingProfile = v;
      continue;
    }
    if (a === "--max-tokens" || a === "-n") {
      maxOutputTokens = Number(argv[++i] ?? "2048");
      continue;
    }
    if (a === "--help" || a === "-h") {
      console.log(
        "Usage: bun run src/dial.ts [--profile eco|auto|premium] [--max-tokens N] <prompt>",
      );
      process.exit(0);
    }
    promptParts.push(a);
  }

  const prompt = promptParts.join(" ").trim();
  if (!prompt) {
    throw new Error("prompt required (local dial; no network)");
  }
  return { prompt, routingProfile, maxOutputTokens };
}

if (import.meta.main) {
  const result = dial(parseArgs(process.argv.slice(2)));
  console.log(formatDial(result));
}
