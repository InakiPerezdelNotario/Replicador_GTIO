npm rebuild

set -m

nodejs /tmp/server/proxy_1.js &
nodejs /tmp/server/sequenciador.js &
nodejs /tmp/server/manejador.js 1 1  &
nodejs /tmp/server/server.js 1 1
