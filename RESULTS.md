# Results

Local ship gate recorded **2026-10-14** (keyless lab suite). Upstream npm CI runs in GitHub Actions via `scripts/upstream-ci.sh`.

- Bun `1.4.3` · TypeScript `5.9.3` · engines `node >=24.16.0`
- Upstream pin `BlockRunAI/ClawRouter@147d1b9f2c2b` / npm `@blockrun/clawrouter@0.12.287`
- `bun audit` (npm registry override): no vulnerabilities (27 ignored GHSAs from pin — see SECURITY.md)

| Check | Result | Note |
| --- | --- | --- |
| `bun test` | **pass** | 7 passed — scoped to `./tests` only (not vendor) |
| `bun run typecheck` | **pass** | `tsc --noEmit` |
| `bun run check:skills` | **pass** | skills-layout ok |
| `bun run audit` | **pass** | 198 packages checked |
| `test ! -e .cursor/skills && test ! -e .agents/skills` | **pass** | no skill mirrors |

Lab dial tests: **7 passed**.

Upstream `scripts/upstream-ci.sh`: Linux CI (`upstream` job) at pin with throwaway `HOME`; no wallet keys in CI.
