export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const sql = getDb()

  if (body.action === 'delete') {
    await sql`DELETE FROM zikr_entries WHERE id = ${body.id}`
    return { ok: true }
  }

  if (body.action === 'save') {
    const { id, arabic, translation, image } = body.entry
    await sql`
      INSERT INTO zikr_entries (id, arabic, translation, image_url)
      VALUES (${id}, ${arabic}, ${translation ?? ''}, ${image ?? ''})
      ON CONFLICT (id) DO UPDATE SET
        arabic      = EXCLUDED.arabic,
        translation = EXCLUDED.translation,
        image_url   = EXCLUDED.image_url
    `
    return { ok: true }
  }

  throw createError({ statusCode: 400, statusMessage: 'Invalid action' })
})
