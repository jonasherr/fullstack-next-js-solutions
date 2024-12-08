import { listingsTable } from "@/app/(app)/lib/db/listings.sql";
import { reviewsTable } from "@/app/(app)/listing/[listingId]/reviews/lib/db/reviews.sql";
import { usersToBookingsTable } from "@/lib/db/schema.sql";
import { relations, sql } from "drizzle-orm";
import { integer, pgTable, text, check } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    age: integer().notNull(),
    email: text().notNull().unique(),
    phone: text(),
  },
  (table) => [check("age_check", sql`${table.age} > 17`)],
);

export const usersRelation = relations(usersTable, ({ one, many }) => ({
  reviews: many(reviewsTable),
  listings: many(listingsTable),
  usersToBooking: one(usersToBookingsTable),
}));
