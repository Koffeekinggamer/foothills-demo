#!/usr/bin/env bash
# Lighthouse mobile (default throttling) against the local server. Usage: tools/lh.sh [run-tag]
set -u
LH=/workspace/design-audit/node_modules/.bin/lighthouse
export CHROME_PATH=/usr/bin/google-chrome
TAG=${1:-r1}
ORIGIN=${ORIGIN:-http://localhost:4321/foothills-demo}
EXTRA=${EXTRA:-}
# PAGES="name=/path name2=/path2" overrides the default sample.
PAGES=${PAGES:-"home=/ collection=/collections/dining-benches product=/products/west-lake-mission-amish-bench-with-back contact=/pages/contact-us book=/pages/book"}
declare -A P=(); KEYS=()
for kv in $PAGES; do P[${kv%%=*}]=${kv#*=}; KEYS+=("${kv%%=*}"); done
for k in "${KEYS[@]}"; do
  $LH "${ORIGIN}${P[$k]}" --quiet --chrome-flags="--headless=new --no-sandbox ${EXTRA}" --output=json --output=html \
    --output-path="lighthouse/${k}-${TAG}" --only-categories=performance,accessibility,best-practices,seo >/dev/null 2>&1
done
python3 - "$TAG" "${KEYS[@]}" <<'PY'
import json,sys
tag=sys.argv[1]
for k in sys.argv[2:]:
    d=json.load(open(f'lighthouse/{k}-{tag}.report.json'))
    c=d['categories'];a=d['audits']
    print(f"{k:13} perf {round(c['performance']['score']*100):3}  a11y {round(c['accessibility']['score']*100):3}  bp {round(c['best-practices']['score']*100):3}  seo {round(c['seo']['score']*100):3}  "
          f"FCP {a['first-contentful-paint']['displayValue']:>6}  LCP {a['largest-contentful-paint']['displayValue']:>6}  TBT {a['total-blocking-time']['displayValue']:>6}  CLS {a['cumulative-layout-shift']['displayValue']:>5}  "
          f"bytes {round(a['total-byte-weight']['numericValue']/1024)}KB")
PY
