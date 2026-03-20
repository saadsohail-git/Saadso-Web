import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const { slug } = body

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  await unlink(filePath)

  return { ok: true }
})
