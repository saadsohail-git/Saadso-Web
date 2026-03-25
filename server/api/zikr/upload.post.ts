import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'

function getUploadsDir(): string {
  if (process.env.NODE_ENV === 'production') {
    return '/var/www/saadso-uploads/zikr'
  }
  return join(process.cwd(), 'public', 'uploads', 'zikr')
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
  const uploadsDir = getUploadsDir()

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(join(uploadsDir, safeName), filePart.data)

  return { url: `/uploads/zikr/${safeName}` }
})
