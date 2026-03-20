import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'content', 'links.md')
  try {
    return await readFile(filePath, 'utf-8')
  } catch {
    return ''
  }
})
