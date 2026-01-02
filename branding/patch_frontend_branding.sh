#!/bin/sh
set -e

# Replace Blockscout branding strings and links in the compiled frontend bundle.
if [ ! -d /app/.next ]; then
  echo "branding: missing /app/.next" > /tmp/branding_patch_log
else
  count=$(grep -R -l -E 'Blockscout|blockscout' /app/.next/server /app/.next/static 2>/dev/null | grep -E '\.js$' | wc -l || true)
  echo "branding files: $count" > /tmp/branding_patch_log
fi
grep -R -l -E 'Blockscout|blockscout' /app/.next/server /app/.next/static 2>/dev/null | \
  grep -E '\.js$' | \
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    sed -i.bak \
      -e 's|https://www.blockscout.com/chains-and-projects|https://scan.entrocryptopay.com|g' \
      -e 's|https://eth.blockscout.com|https://scan.entrocryptopay.com|g' \
      -e 's|https://www.blockscout.com|https://entrocryptopay.com|g' \
      -e 's|https://merits.blockscout.com|https://entrocryptopay.com|g' \
      -e 's|https://vera.blockscout.com|https://entrocryptopay.com|g' \
      -e 's|https://docs.blockscout.com|https://entrocryptopay.com/docs|g' \
      -e 's|https://github.com/blockscout/frontend|https://github.com/entrocryptopay/entropay-scan|g' \
      -e 's|https://github.com/blockscout/blockscout|https://github.com/entrocryptopay/entropay-scan|g' \
      -e 's|https://x.com/blockscout|https://x.com/entrocryptopay|g' \
      -e 's|https://www.x.com/blockscoutcom/|https://www.x.com/entrocryptopay/|g' \
      -e 's|https://discord.gg/blockscout|https://discord.gg/entrocryptopay|g' \
      -e 's|utm_source=blockscout|utm_source=entropay|g' \
      -e 's|Blockscout Limited|Entropay Limited|g' \
      -e 's|Blockscout|Entropay|g' \
      "$file"
    rm -f "${file}.bak"
  done

touch /tmp/branding_patch_done
