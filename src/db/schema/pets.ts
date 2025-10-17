import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const pets = pgTable('pets', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	type: text('type').notNull(),
	breed: text('breed'),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
