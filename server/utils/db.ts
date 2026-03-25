import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

export function getDb(): ReturnType<typeof postgres> {
  if (_sql) return _sql

  const config = useRuntimeConfig()
  const url = config.databaseUrl

  if (!url) {
    throw new Error('DATABASE_URL is not set. Add it to your .env file.')
  }

  _sql = postgres(url, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  })

  return _sql
}
