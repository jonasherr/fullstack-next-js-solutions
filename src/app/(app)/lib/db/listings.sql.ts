import { usersTable } from "@/app/(auth)/lib/db/users.sql";
import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, check } from "drizzle-orm/pg-core";
import { reviewsTable } from "../../listing/[listingId]/reviews/lib/db/reviews.sql";
import { bookingsTable } from "../../listing/[listingId]/booking/lib/db/bookings.sql";

export const listingsTable = pgTable(
  "listings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    price: integer().notNull(),
    image: text().notNull(),
    description: text().notNull(),
    kitchen: boolean().notNull(),
    wifi: boolean().notNull(),
    tv: boolean().notNull(),
    bedrooms: integer().notNull(),
    address: text().notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
  },
  (table) => [
    check("price_check", sql`${table.price} > 0`),
    check("bedrooms_check", sql`${table.bedrooms} > 0`),
  ],
);

export const listingsRelation = relations(listingsTable, ({ one, many }) => ({
  users: one(usersTable, {
    fields: [listingsTable.userId],
    references: [usersTable.id],
  }),
  reviews: many(reviewsTable),
  bookings: many(bookingsTable),
}));
