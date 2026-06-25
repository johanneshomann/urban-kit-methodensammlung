#!/usr/bin/env bash
#
# Database + uploaded-media backup for the urban-kit methodensammlung stack.
#
# Ships with the repo and is deployed via `git pull`. Run it from cron on the
# server (the only host-level step — cron config can't live in git):
#
#   30 3 * * * /root/projects/urban-kit-methodensammlung/urban-kit-methodensammlung/scripts/backup.sh \
#              >> /root/projects/urban-kit-methodensammlung/backups/backup.log 2>&1
#
# Produces two files per run in the backup dir:
#   db_<stamp>.archive.gz    — mongodump --archive --gzip of the urban-kit DB
#   media_<stamp>.tar.gz     — the media_data + icons_data volumes
#
# Overridable via env: BACKUP_DIR, BACKUP_KEEP_DAYS, MONGO_DB
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="$(basename "$ROOT")"                    # = docker compose project name
DEST="${BACKUP_DIR:-$ROOT/../backups}"           # default: sibling of the repo (outside git)
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
DB="${MONGO_DB:-urban-kit}"
STAMP="$(date +%Y-%m-%d_%H%M)"

mkdir -p "$DEST"

PW="$(grep '^MONGO_ROOT_PASSWORD=' "$ROOT/.env" | cut -d= -f2-)"
[ -n "$PW" ] || { echo "ERROR: MONGO_ROOT_PASSWORD not found in $ROOT/.env" >&2; exit 1; }

# 1) Database — password passed via env so it never shows up in `docker inspect`/ps
docker exec -e PW="$PW" "${PROJECT}-mongodb-1" \
  sh -c "mongodump --username urbankit --password \"\$PW\" --authenticationDatabase admin \
         --db $DB --archive --gzip" > "$DEST/db_$STAMP.archive.gz"

# 2) Uploaded media (lives in volumes, not in Mongo)
docker run --rm \
  -v "${PROJECT}_media_data:/media:ro" \
  -v "${PROJECT}_icons_data:/icons:ro" \
  -v "$DEST:/backup" alpine \
  tar czf "/backup/media_$STAMP.tar.gz" -C / media icons

# 3) Rotate — drop archives older than KEEP_DAYS
find "$DEST" -name 'db_*.archive.gz' -mtime "+$KEEP_DAYS" -delete
find "$DEST" -name 'media_*.tar.gz'  -mtime "+$KEEP_DAYS" -delete

echo "[$(date '+%F %T')] backup ok -> $DEST (db_$STAMP, media_$STAMP)"
