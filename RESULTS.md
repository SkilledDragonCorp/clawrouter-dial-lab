# Results

Local ship gate recorded **2026-10-14** (keyless lab suite). Upstream cohort runs on Linux CI (`scripts/upstream-ci.sh` @ `147d1b9f2c2b`).

- Bun `1.4.3` · TypeScript `5.9.3` · Node engines `>=24.16.0`
- npm pin `@blockrun/clawrouter@0.12.287`
- `bun audit` (npmjs registry override): no vulnerabilities (27 ignored GHSAs — see SECURITY.md)

| Check | Result | Note |
| --- | --- | --- |
| `bun install --frozen-lockfile` | **pass** | Lockfile present |
| `bun test ./tests` | **pass** | 7 passed |
| `bun run typecheck` | **pass** | `tsc --noEmit` |
| `bun run check:skills` | **pass** | skills-layout ok |
| `bun run audit` | **pass** | `npm_config_registry` only |
| No `.cursor/skills` / `.agents/skills` | **pass** | Gate |
| `.env` gitignored | **pass** | No wallet keys in CI |

Lab tests: **7 passed**. Upstream CI deferred to GitHub Actions `upstream` job.
