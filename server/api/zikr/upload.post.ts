import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { existsSync } from 'fs'

function getPublicUploadsDir(): string {
  const cwd = process.cwd()
  const outputPublic = join(cwd, '.output', 'public')
  if (existsSync(outputPublic)) {
    return join(outputPublic, 'uploads', 'zikr')
  }
  return join(cwd, 'public', 'uploads', 'zikr')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, statusMessage: 'No data' })

  const passwordPart = parts.find(p => p.name === 'password')
  const password = passwordPart?.data?.toString() ?? ''
  if (password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const filePart = parts.find(p => p.name === 'file' && p.filename)
  if (!filePart) throw createError({ statusCode: 400, statusMessage: 'No file' })

  const ext = extname(filePart.filename || '').toLowerCase() || '.jpg'
  const safeName = `${Date.now()}${ext}`
  const uploadsDir = getPublicUploadsDir()

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(join(uploadsDir, safeName), filePart.data)

  return { url: `/uploads/zikr/${safeName}` }
})
