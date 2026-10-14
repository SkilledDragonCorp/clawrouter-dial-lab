# clawrouter-dial-lab

**Built by SkilledDragon LLC — architecture-led software engineering · [skilleddragon.com](https://skilleddragon.com)**

Bun/TypeScript minilab around [@blockrun/clawrouter](https://www.npmjs.com/package/@blockrun/clawrouter) `0.12.287` (git pin `BlockRunAI/ClawRouter@147d1b9f2c2b`). A tiny **dial** calls the **real** local `route()` API with a **fake** in-memory `modelPricing` Map — no proxy, wallet, or network — and prints which model would be chosen.

Vendor marketing hedge (not our measurement): **hasta ~84% vs Opus 5 fijo (mezcla del vendor)**.

npm downloads context (label only): last-week **4,167** via api.npmjs.org week ending 2026-10-11; latest at pin **0.12.287**.

## What we built

| Piece | Purpose |
| --- | --- |
| `src/dial.ts` | Local dial over `@blockrun/clawrouter/router` + fake pricing Map |
| `tests/dial.test.ts` | Bun tests (keyless; no network) |
| `scripts/upstream-ci.sh` | Verbatim upstream lint/build/test/integration at `147d1b9f2c2b` |
| `.claude/skills/model-route-dial/` | Skill for Claude Code / Cursor |
| CI | `lab` + `upstream` + `security` (gitleaks 8.30.1, osv-scanner 2.7.0, `bun audit`) |

## Featured upstream

- Repo: https://github.com/BlockRunAI/ClawRouter — MIT
- **Pin:** `147d1b9f2c2b` / npm `@blockrun/clawrouter@0.12.287`
- Keyless CI source: `.github/workflows/ci.yml` at that pin (Node **22**)
- Lab `engines.node`: `>=24.16.0` because the published package’s `openclaw` dep requires that floor

## Exact upstream commands

Inside `vendor/ClawRouter` @ `147d1b9f2c2b` with throwaway `HOME`:

```bash
npm ci && npx prettier --check . && npx eslint src/ && npm run typecheck
npm run build && timeout 900 npm test && node scripts/sync-brand-numbers.mjs --check
npx vitest run --config vitest.integration.config.ts test/integration/lifecycle.test.ts
```

## Setup

```bash
cp .env.example .env
bun install
bun test
bun run typecheck
bun run check:skills
bun run src/dial.ts --profile eco "Prove sqrt(2) is irrational"
```

Upstream cohort (needs Node 22, network; Linux preferred for `timeout`):

```bash
bash scripts/upstream-ci.sh
```

## What we tested

See [RESULTS.md](./RESULTS.md) for the latest local green table.

## Tutorial

1. Copy `.env.example` → `.env` (keyless dial; optional `BLOCKRUN_API_KEY` for live gateway only).
2. Run `bun test` to confirm the fake-pricing dial.
3. Run `bun run src/dial.ts --profile eco "your prompt"` to see the chosen model.
4. Run `bash scripts/upstream-ci.sh` (or rely on CI `upstream`) to prove the pin.
5. Hedge savings with the vendor note — do not claim 84% as this lab’s result.

## Using these skills in Claude Code and Cursor

Skills live **only** under `.claude/skills/<name>/SKILL.md`. Do not create `.cursor/skills` or `.agents/skills` mirrors — CI fails if those paths exist.

- **Claude Code:** project skills under `.claude/skills/` load automatically for this repo.
- **Cursor:** point the agent at `.claude/skills/model-route-dial/SKILL.md` (same path; no duplicate tree).

Skill: **model-route-dial** — real local `route()`, fake pricing Map, no wallet keys in CI.

## API keys

| Variable | Required | Notes |
| --- | --- | --- |
| _(none)_ | — | Keyless dial + upstream npm CI |
| `BLOCKRUN_API_KEY` | optional | `brk_live_…` from [user.blockrun.ai](https://user.blockrun.ai); card-funded; vendor says 7 models free with no key |
| `BLOCKRUN_WALLET_KEY` / `SOLANA_WALLET_KEY` | **forbidden in CI** | Never set; throwaway `HOME` for upstream script |
| `DISABLE_TELEMETRY` | recommended | `1` |
| `DO_NOT_TRACK` | recommended | `1` |

## License

MIT — see [LICENSE](./LICENSE). Upstream [BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) is also MIT.
