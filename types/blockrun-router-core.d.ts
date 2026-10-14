/**
 * @blockrun/clawrouter@0.12.287 re-exports unpublished @blockrun/router-core
 * from dist/router/index.d.ts. This declaration lets tsc resolve the types
 * without installing the private package.
 */
declare module "@blockrun/router-core" {
  export type ModelPricing = {
    inputPrice: number;
    outputPrice: number;
  };

  export type RoutingProfile = "free" | "eco" | "auto" | "premium";

  export type TierConfig = {
    primary: string;
    fallback: string[];
  };

  export type RoutingConfig = {
    version: string;
    strategy?: string;
    tiers: Record<string, TierConfig>;
    [key: string]: unknown;
  };

  export type RoutingDecision = {
    model: string;
    tier: string;
    confidence: number;
    method: string;
    reasoning: string;
    costEstimate: number;
    baselineCost: number;
    savings: number;
    profile?: string;
    candidates?: string[];
    taskType?: string;
    routerVersion?: string;
    agenticScore?: number;
    [key: string]: unknown;
  };

  export const DEFAULT_ROUTING_CONFIG: RoutingConfig;

  export function route(
    prompt: string,
    systemPrompt: string | undefined,
    maxOutputTokens: number,
    options: {
      config: RoutingConfig;
      modelPricing: Map<string, ModelPricing>;
      routingProfile?: RoutingProfile;
    },
  ): RoutingDecision;
}
