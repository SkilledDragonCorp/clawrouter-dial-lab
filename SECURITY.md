# Security Policy

**Built by [SkilledDragon LLC](https://skilleddragon.com)**

This is a **SkilledDragon educational minilab**, not a production product. We do **not** maintain these repos on a regular schedule and we do **not** operate a vulnerability response program for them.

## Supported versions

Only the default branch (`main`) of this minilab is considered current. Older commits are archival.

## Contact

General questions: **hello@skilleddragon.com**  
Do not use a dedicated security mailbox for this repo — none exists.

## If you find an issue

- Prefer reporting **upstream** when the issue is in [BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter) / npm `@blockrun/clawrouter`, or other dependencies.
- For something specific to this minilab’s dial or CI, you may email hello@skilleddragon.com. There is **no SLA**, and we may not patch or reply quickly.
- Do not expect private coordinated disclosure or paid bounty handling here.

## Secret-handling policy

- The keyless dial uses the **local** `route()` API with a **fake** `modelPricing` Map. No wallet, no proxy, no network.
- **Never** set `BLOCKRUN_WALLET_KEY` or `SOLANA_WALLET_KEY` in CI. Upstream proxy code can create a wallet under `~/.openclaw/blockrun` on first run — `scripts/upstream-ci.sh` uses a throwaway `HOME`.
- Optional `BLOCKRUN_API_KEY` (`brk_live_…`, card-funded at [user.blockrun.ai](https://user.blockrun.ai)) is documented in `.env.example` only for live gateway experiments outside CI. Vendor states 7 models are free with no key.
- Telemetry is disabled via `DISABLE_TELEMETRY=1` and `DO_NOT_TRACK=1`.

## Audit coverage note

`bun audit` covers dependencies resolved through the Bun lockfile. Some transitive deps of `@blockrun/clawrouter` arrive via **codeload / tarball** URLs and are **not** covered by `bun audit`. Upstream Node lockfile risk is scanned separately with **osv-scanner v2.7.0** against `vendor/ClawRouter/package-lock.json` at pin `147d1b9f2c2b`.

`scripts/bun-audit.sh` ignores known transitive GHSAs introduced solely by the pinned `@blockrun/clawrouter@0.12.287` tree (notably `axios@0.27.2` via `@polymarket/builder-relayer-client`, plus `elliptic` / `ws` under Polymarket clients). The dial itself never opens those network paths. Re-run a raw `bun audit` and refresh the ignore list when bumping the package pin.

## Tooling pins

| Check | Pin |
| --- | --- |
| npm `@blockrun/clawrouter` | `0.12.287` |
| BlockRunAI/ClawRouter | `147d1b9f2c2b` |
| gitleaks | `v8.30.1` (CI binary + SHA256 verify) |
| osv-scanner | `v2.7.0` (CI binary + SHA256 verify on upstream `package-lock.json`) |
| Node (lab engines) | `>=24.16.0` (`.nvmrc` = `24`; openclaw floor) |
| Node (upstream CI) | `22` (verbatim from upstream `ci.yml`) |

Pre-commit: `.pre-commit-config.yaml` pins the gitleaks hook to `v8.30.1`.

Use at your own risk. Pin versions, review the code, and treat this as sample material.
