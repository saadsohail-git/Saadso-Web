import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  const raw = await readFile(filePath, 'utf-8')

  // Parse frontmatter and content
  const match = raw.match(/^---\n([\s\S]*?)\n---\n*([\s\S]*)/)
  if (!match) {
    return { slug, title: slug, description: '', date: '', content: raw }
  }

  const fm = match[1]
  const content = match[2].trim()

  const title = fm.match(/title:\s*(.+)/)?.[1]?.trim() || slug
  const description = fm.match(/description:\s*(.+)/)?.[1]?.trim() || ''
  const date = fm.match(/date:\s*'?(.+?)'?\s*$/m)?.[1]?.trim() || ''

  return { slug, title, description, date, content }
})
