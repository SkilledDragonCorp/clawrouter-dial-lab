---
name: model-route-dial
description: >-
  Dial which LLM ClawRouter would pick for a prompt using the real local
  route() API and a fake in-memory pricing Map — no proxy, wallet, or network.
---

# Model route dial

Use this skill when you need a **local, keyless** answer to “which model would
ClawRouter choose?” without opening BlockRun’s gateway.

## Rules

1. Call the lab dial (`bun run src/dial.ts` or `dial()` from `src/dial.ts`).
2. Pass a **fake** `modelPricing` Map (USD per 1M tokens). Never invent live
   prices from the network in CI.
3. Use `DEFAULT_ROUTING_CONFIG` from `@blockrun/clawrouter/router`.
4. Profiles: `eco` | `auto` | `premium` (lab default: `eco`).
5. **Never** set `BLOCKRUN_WALLET_KEY` or `SOLANA_WALLET_KEY` in CI. Optional
   card-funded `BLOCKRUN_API_KEY` is for live gateway calls outside this dial.
6. Hedge vendor savings as **hasta ~84% vs Opus 5 fijo (mezcla del vendor)** —
   never state 84% as this lab’s measurement.

## Quickstart

```bash
bun install --frozen-lockfile
bun run src/dial.ts --profile eco "Prove sqrt(2) is irrational"
bun test
```

## Upstream pin

- npm: `@blockrun/clawrouter@0.12.287`
- git: `BlockRunAI/ClawRouter@147d1b9f2c2b`
- Upstream cohort: `bash scripts/upstream-ci.sh`
