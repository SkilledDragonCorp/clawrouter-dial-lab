#!/usr/bin/env bash
# Upstream CI commands from BlockRunAI/ClawRouter .github/workflows/ci.yml
# at 147d1b9f2c2b7d31e3f7506a81b71bc421b9f53b (lint + build-and-test; Node 22).
# Desktop job is out of scope.
#
# One command per line (same argv as upstream) so set -e stops on failure.
set -euo pipefail

export DO_NOT_TRACK=1
export DISABLE_TELEMETRY=1
# Never set BLOCKRUN_WALLET_KEY / SOLANA_WALLET_KEY.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIN="147d1b9f2c2b7d31e3f7506a81b71bc421b9f53b"
VENDOR="${ROOT}/vendor/ClawRouter"
REAL_HOME="${HOME}"

# Darwin may lack GNU timeout; keep the same timeout 900 invocation.
if ! command -v timeout >/dev/null 2>&1; then
  timeout() {
    local secs="$1"
    shift
    perl -e 'alarm shift; exec @ARGV' "$secs" "$@"
  }
fi

# Prefer Node 22 locally when nvm is available (matches upstream ci.yml).
if [[ -z "${CLAWROUTER_UPSTREAM_NODE_READY:-}" ]]; then
  if [[ -s "${REAL_HOME}/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1091
    source "${REAL_HOME}/.nvm/nvm.sh"
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

# Throwaway HOME so wallet bootstrap cannot touch real ~/.openclaw.
THROW_HOME="$(mktemp -d)"
export HOME="${THROW_HOME}"

# Lab bun-types above vendor/ leaks into upstream tsc locally.
# CI upstream job does not install lab deps.
restore_lab_types() {
  local bak
  for bak in \
    "${ROOT}/node_modules/bun-types.__upstream_bak" \
    "${ROOT}/node_modules/@types/bun.__upstream_bak"; do
    if [[ -e "${bak}" ]]; then
      mv "${bak}" "${bak%.__upstream_bak}"
    fi
  done
  rm -rf "${THROW_HOME}"
  export HOME="${REAL_HOME}"
}
trap restore_lab_types EXIT

if [[ -e "${ROOT}/node_modules/bun-types" ]]; then
  mv "${ROOT}/node_modules/bun-types" "${ROOT}/node_modules/bun-types.__upstream_bak"
fi
if [[ -e "${ROOT}/node_modules/@types/bun" ]]; then
  mv "${ROOT}/node_modules/@types/bun" "${ROOT}/node_modules/@types/bun.__upstream_bak"
fi

# Exact upstream commands (ci.yml at pin):
npm ci
npx prettier --check .
npx eslint src/
npm run typecheck
npm run build
# Serialize vitest workers — default parallelism races on shared proxy/ledger
# state under load (Darwin local + busy CI). Command remains `npm test`.
export VITEST_MAX_WORKERS=1
export VITEST_MAX_THREADS=1
export VITEST_MIN_THREADS=1
timeout 900 npm test
node scripts/sync-brand-numbers.mjs --check
npx vitest run --config vitest.integration.config.ts test/integration/lifecycle.test.ts

echo "upstream CI green at ${PIN}"
