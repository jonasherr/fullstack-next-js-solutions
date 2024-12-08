import { listingsTable } from "@/app/(app)/lib/db/listings.sql";
import { usersTable } from "@/app/(auth)/lib/db/users.sql";
import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, date, real, check } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable(
  "reviews",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    rating: real().notNull(),
    content: text().notNull(),
    date: date().notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listingsTable.id),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 0 AND 5`)],
);

export const reviewsRelation = relations(reviewsTable, ({ one }) => ({
  listing: one(listingsTable, {
    fields: [reviewsTable.listingId],
    references: [listingsTable.id],
  }),
  user: one(usersTable, {
    fields: [reviewsTable.userId],
    references: [usersTable.id],
  }),
}));
