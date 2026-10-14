#!/usr/bin/env bash
# bun audit with ignores for transitive GHSAs from pinned @blockrun/clawrouter@0.12.287.
# Re-evaluate when bumping the package pin. See SECURITY.md.
set -euo pipefail

export npm_config_registry="${npm_config_registry:-https://registry.npmjs.org}"

# Do not also set NPM_CONFIG_REGISTRY in the same env block (GHA note).
bun audit \
  --ignore=GHSA-jr5f-v2jv-69x6 \
  --ignore=GHSA-fvcv-3m26-pcqx \
  --ignore=GHSA-62hf-57xw-28j9 \
  --ignore=GHSA-hfxv-24rg-xrqf \
  --ignore=GHSA-p92q-9vqr-4j8w \
  --ignore=GHSA-p92q-9vqr-4j8v \
  --ignore=GHSA-j5f8-grm9-p9fc \
  --ignore=GHSA-3g43-6gmg-66jw \
  --ignore=GHSA-898c-q2cr-xwhg \
  --ignore=GHSA-3p68-rc4w-qgx5 \
  --ignore=GHSA-w9j2-pvgh-6h63 \
  --ignore=GHSA-pmwg-cvhr-8vh7 \
  --ignore=GHSA-xhjh-pmcv-23jw \
  --ignore=GHSA-m7pr-hjqh-92cm \
  --ignore=GHSA-5c9x-8gcm-mpgx \
  --ignore=GHSA-vf2m-468p-8v99 \
  --ignore=GHSA-pf86-5x62-jrwf \
  --ignore=GHSA-6chq-wfr3-2hj9 \
  --ignore=GHSA-xx6v-rp6x-q39c \
  --ignore=GHSA-43fc-jf86-j433 \
  --ignore=GHSA-pjwm-pj3p-43mv \
  --ignore=GHSA-wf5p-g6vw-rhxx \
  --ignore=GHSA-mmx7-hfxf-jppx \
  --ignore=GHSA-7q8q-rj6j-mhjq \
  --ignore=GHSA-9fr6-4gfg-395g \
  --ignore=GHSA-848j-6mx2-7j84 \
  --ignore=GHSA-58qx-3vcg-4xpx \
  --ignore=GHSA-96hv-2xvq-fx4p
