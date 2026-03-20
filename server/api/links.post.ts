import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const filePath = join(process.cwd(), 'content', 'links.md')
  await writeFile(filePath, body.content, 'utf-8')
  return { ok: true }
})
