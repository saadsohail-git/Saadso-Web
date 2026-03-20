import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // Check admin password
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const { slug, title, description, date, tags, content } = body

  if (!slug || !title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug, title, or content' })
  }

  // Build frontmatter
  const frontmatter = [
    '---',
    `title: ${title}`,
    `description: ${description || ''}`,
    `date: '${date || new Date().toISOString().split('T')[0]}'`,
    `tags: [${(tags || []).join(', ')}]`,
    '---',
  ].join('\n')

  const fileContent = `${frontmatter}\n\n${content}\n`

  // Write to content/blog/ directory
  const contentDir = join(process.cwd(), 'content', 'blog')
  await mkdir(contentDir, { recursive: true })
  const filePath = join(contentDir, `${slug}.md`)

  await writeFile(filePath, fileContent, 'utf-8')

  return { ok: true, path: `/blog/${slug}` }
})
