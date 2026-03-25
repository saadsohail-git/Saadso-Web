import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const filePath = join(process.cwd(), 'content', 'zikr.json')

  let entries: any[] = []
  try {
    const raw = await readFile(filePath, 'utf-8')
    entries = JSON.parse(raw)
  } catch {
    entries = []
  }

  if (body.action === 'delete') {
    entries = entries.filter((e: any) => e.id !== body.id)
  } else if (body.action === 'save') {
    const entry = body.entry
    const idx = entries.findIndex((e: any) => e.id === entry.id)
    if (idx >= 0) {
      entries[idx] = entry
    } else {
      entries.push(entry)
    }
  }

  await writeFile(filePath, JSON.stringify(entries, null, 2), 'utf-8')
  return { ok: true }
})
