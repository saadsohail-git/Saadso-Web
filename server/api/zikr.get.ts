export default defineEventHandler(async () => {
  const sql = getDb()
  const rows = await sql`
    SELECT id, arabic, translation, image_url, sort_order
    FROM zikr_entries
    ORDER BY sort_order ASC, created_at ASC
  `
  return rows.map(r => ({
    id: r.id,
    arabic: r.arabic,
    translation: r.translation,
    image: r.image_url,
  }))
})
