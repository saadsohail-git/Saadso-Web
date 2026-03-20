import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async () => {
  const contentDir = join(process.cwd(), 'content', 'blog')

  if (!existsSync(contentDir)) {
    return []
  }

  const files = await readdir(contentDir)
  const posts = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    const raw = await readFile(join(contentDir, file), 'utf-8')
    const slug = file.replace('.md', '')

    // Parse frontmatter
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!match) continue

    const fm = match[1]
    const title = fm.match(/title:\s*(.+)/)?.[1]?.trim() || slug
    const description = fm.match(/description:\s*(.+)/)?.[1]?.trim() || ''
    const date = fm.match(/date:\s*'?(.+?)'?\s*$/m)?.[1]?.trim() || ''

    posts.push({ slug, title, description, date })
  }

  // Sort by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date))

  return posts
})
