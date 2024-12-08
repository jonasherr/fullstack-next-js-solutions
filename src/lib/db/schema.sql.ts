import { bookingsTable } from "@/app/(app)/listing/[listingId]/booking/lib/db/bookings.sql";
import { usersTable } from "@/app/(auth)/lib/db/users.sql";
import { relations } from "drizzle-orm";
import { integer, pgTable } from "drizzle-orm/pg-core";

export const usersToBookingsTable = pgTable("users_to_bookings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookingsTable.id),
});

export const usersToBookingsRelation = relations(
  usersToBookingsTable,
  ({ one }) => ({
    booking: one(bookingsTable, {
      fields: [usersToBookingsTable.bookingId],
      references: [bookingsTable.id],
    }),
    user: one(usersTable, {
      fields: [usersToBookingsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
