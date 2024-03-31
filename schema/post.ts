import { sql } from 'drizzle-orm'
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const post = pgTable('post', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  ip: text('ip').notNull(),
  type: varchar('type', { length: 1 }).default('N'),
  views: integer('views').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})
