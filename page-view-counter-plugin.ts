import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin } from 'vite'

const viewCounterFile = path.resolve(process.cwd(), 'data/page-views.json')
let warnedMissingViewCounter = false

type ViewCounterData = {
  views: number
}

function isMissingFileError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  )
}

function warnMissingViewCounter() {
  if (warnedMissingViewCounter) return

  warnedMissingViewCounter = true
  console.warn(
    `Page view counter disabled: missing ${path.relative(process.cwd(), viewCounterFile)}. Run "npm run init:page-views" to create it.`,
  )
}

async function readViewCounter(): Promise<ViewCounterData> {
  try {
    const file = await fs.readFile(viewCounterFile, 'utf8')
    const data = JSON.parse(file) as Partial<ViewCounterData>

    return {
      views: typeof data.views === 'number' ? data.views : 0,
    }
  } catch (error) {
    if (isMissingFileError(error)) {
      warnMissingViewCounter()
      throw error
    }

    return { views: 0 }
  }
}

async function writeViewCounter(data: ViewCounterData) {
  await fs.mkdir(path.dirname(viewCounterFile), { recursive: true })
  await fs.writeFile(viewCounterFile, `${JSON.stringify(data, null, 2)}\n`)
}

export function pageViewCounterPlugin(): Plugin {
  return {
    name: 'page-view-counter',
    configureServer(server) {
      server.middlewares.use('/api/page-views', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        try {
          if (req.method === 'GET') {
            const data = await readViewCounter()
            res.end(JSON.stringify(data))
            return
          }

          if (req.method === 'POST') {
            const data = await readViewCounter()
            const nextData = { views: data.views + 1 }
            await writeViewCounter(nextData)
            res.end(JSON.stringify(nextData))
            return
          }

          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        } catch (error) {
          if (isMissingFileError(error)) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Page view counter file is missing' }))
            return
          }

          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Unable to update page views' }))
        }
      })
    },
  }
}
