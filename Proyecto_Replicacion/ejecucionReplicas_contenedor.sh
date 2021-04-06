npm rebuild

set -m

nodejs /tmp/server/proxy_2.js &
nodejs /tmp/server/replica.js 1
