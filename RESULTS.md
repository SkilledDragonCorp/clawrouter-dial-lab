# Results — clawrouter-dial-lab

Local green run before push (2026-10-14).

| Check | Command | Result |
| --- | --- | --- |
| Lab unit tests | `bun test` | **pass** (7/7) |
| Typecheck | `bun run typecheck` | **pass** |
| Skills layout | `bun run check:skills` | **pass** |
| Dial smoke | `bun run src/dial.ts --profile eco "…"` | **pass** (local `route()`, no network) |
| Bun audit | `bun run audit` (`scripts/bun-audit.sh`) | **pass** (27 ignored transitive GHSAs from pin) |
| No skill mirrors | `test ! -e .cursor/skills && test ! -e .agents/skills` | **pass** |
| Upstream cohort | `bash scripts/upstream-ci.sh` @ `147d1b9f2c2b` | **pass** (prettier, eslint, typecheck, build, 1205 tests, brand-numbers, lifecycle integration) |

Upstream notes:

- Node **22** (matches upstream `ci.yml`)
- Throwaway `HOME` (no wallet keys)
- `VITEST_MAX_WORKERS=1` to avoid shared proxy/ledger races under default parallelism
