import type { Config } from 'drizzle-kit'

export default {
  driver: 'pg',
  schema: './schema/*.ts',
  out: './supabase/migrations',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
