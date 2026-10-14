#!/usr/bin/env bash
# Upstream CI commands copied verbatim from BlockRunAI/ClawRouter
# .github/workflows/ci.yml at 147d1b9f2c2b7d31e3f7506a81b71bc421b9f53b
# (lint + build-and-test jobs; Node 22). Desktop job is out of scope.
#
# Commands are one-per-line (same argv as upstream) so `set -e` stops on failure.
# Upstream chains them with && in GHA steps; behavior is equivalent when each
# step must succeed.
set -euo pipefail

export DO_NOT_TRACK=1
export DISABLE_TELEMETRY=1
# Never set BLOCKRUN_WALLET_KEY / SOLANA_WALLET_KEY — throwaway HOME below.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIN="147d1b9f2c2b7d31e3f7506a81b71bc421b9f53b"
VENDOR="${ROOT}/vendor/ClawRouter"

# Darwin may lack GNU timeout; keep the same `timeout 900 …` invocation.
if ! command -v timeout >/dev/null 2>&1; then
  timeout() {
    local secs="$1"
    shift
    perl -e 'alarm shift; exec @ARGV' "$secs" "$@"
  }
fi

# Prefer Node 22 locally when nvm is available (matches upstream ci.yml).
if [[ -z "${CLAWROUTER_UPSTREAM_NODE_READY:-}" ]]; then
  if [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    source "${HOME}/.nvm/nvm.sh"
    nvm install 22 >/dev/null
    nvm use 22 >/dev/null
  fi
fi

echo "upstream node: $(node -v) ($(command -v node))"

if [[ ! -d "${VENDOR}/.git" ]]; then
  git clone https://github.com/BlockRunAI/ClawRouter "${VENDOR}"
fi
git -C "${VENDOR}" fetch --depth=1 origin "${PIN}" 2>/dev/null || \
  git -C "${VENDOR}" fetch origin "${PIN}"
git -C "${VENDOR}" checkout "${PIN}"

cd "${VENDOR}"
export HOME="$(mktemp -d)"
trap 'rm -rf "${HOME}"' EXIT

# Exact upstream commands (ci.yml @ pin):
npm ci
npx prettier --check .
npx eslint src/
npm run typecheck
npm run build
timeout 900 npm test
node scripts/sync-brand-numbers.mjs --check
npx vitest run --config vitest.integration.config.ts test/integration/lifecycle.test.ts

echo "upstream CI green at ${PIN}"
