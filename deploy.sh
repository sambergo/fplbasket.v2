#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

./just-build.sh
printf '%s\n' 'Syncing to Linode...'
# Excluded files are also protected from --delete; never use --delete-excluded.
rsync -av --delete -e ssh \
  --exclude='.git' --exclude='node_modules/' --exclude='.pnpm-store/' \
  --exclude='.env' --exclude='.env.*' --exclude='.migration-backup/' \
  --exclude='coverage/' --exclude='playwright-report/' --exclude='test-results/' \
  --exclude='dist/' --exclude='*.tsbuildinfo' \
  ./ linode:~/fplbasket/

ssh linode 'sh -s' <<'REMOTE'
set -eu
cd "$HOME/fplbasket"
if docker compose version >/dev/null 2>&1; then
  compose() { docker compose "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
  compose() { docker-compose "$@"; }
else
  echo 'Docker Compose is required.' >&2
  exit 1
fi
failure() {
  echo 'Deployment failed. Container diagnostics:' >&2
  compose ps || true
  compose logs --tail=100 server || true
}
trap 'failure' EXIT
# Build first so a build failure leaves the running service available.
compose build server
compose up -d --no-build server
attempt=0
while [ "$attempt" -lt 30 ]; do
  if compose exec -T server node -e 'fetch("http://127.0.0.1:3636/api/v1/health", { signal: AbortSignal.timeout(3000) }).then(async r => { if (!r.ok || (await r.json()).status !== "ok") process.exit(1); }).catch(() => process.exit(1))'; then
    trap - EXIT
    echo 'Deployment completed successfully.'
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 2
done
echo 'Health check timed out.' >&2
exit 1
REMOTE
