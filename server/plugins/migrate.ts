export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  if (!config.databaseUrl) {
    console.warn('[db] DATABASE_URL not set — skipping migration')
    return
  }

  try {
    const sql = getDb()
    await sql`
      CREATE TABLE IF NOT EXISTS zikr_entries (
        id          TEXT PRIMARY KEY,
        arabic      TEXT NOT NULL,
        translation TEXT NOT NULL DEFAULT '',
        image_url   TEXT NOT NULL DEFAULT '',
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `
    console.log('[db] Migration complete')
  } catch (err) {
    console.error('[db] Migration failed:', err)
  }
})
