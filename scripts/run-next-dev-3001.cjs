const { startServer } = require('../node_modules/next/dist/server/lib/start-server')

async function main() {
  await startServer({
    dir: process.cwd(),
    port: 3001,
    isDev: true,
    allowRetry: false,
    hostname: 'localhost',
    minimalMode: false,
    keepAliveTimeout: undefined,
    serverFastRefresh: true,
    experimentalHttpsServer: false,
    quiet: false,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
