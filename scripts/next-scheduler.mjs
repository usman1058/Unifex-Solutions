// Standalone scheduler worker for Unifex social auto-post system.
//
// Usage (Node):
//   node scripts/run-scheduler.mjs --base http://localhost:3000 [--interval 300000]
//
// Or schedule via cron / task scheduler:
//   */5 * * * * node /path/to/unifex/scripts/next-scheduler.mjs --base http://localhost:3000 2>> /var/log/unifex-scheduler.log
//
// It simply calls the /api/scheduled-posts/run endpoint, which publishes all
// posts whose scheduledFor has passed and generates AI content when enabled.

const args = process.argv.slice(2)
function getArg(name, def) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : def
}

const BASE = (getArg('base', process.env.APP_BASE_URL) || 'http://localhost:3000').replace(/\/$/, '')
const INTERVAL = parseInt(getArg('interval', process.env.SCHEDULER_INTERVAL || '60000'), 10)

async function runOnce() {
  try {
    const res = await fetch(`${BASE}/api/scheduled-posts/run`, { method: 'POST' })
    const data = await res.json()
    if (res.ok && data.success) {
      const published = data.data?.published?.length || 0
      if (published > 0) {
        console.log(`[${new Date().toISOString()}] Published ${published} scheduled post(s).`)
      }
    } else {
      console.error(`[${new Date().toISOString()}] Scheduler error:`, data.error?.message || res.status)
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Scheduler fetch failed:`, err.message)
  }
}

console.log(`Unifex scheduler started. Polling ${BASE}/api/scheduled-posts/run every ${INTERVAL}ms`)
runOnce()
setInterval(runOnce, INTERVAL)