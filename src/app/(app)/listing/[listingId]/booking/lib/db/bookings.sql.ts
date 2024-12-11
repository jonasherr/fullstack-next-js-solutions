import { listingsTable } from "@/app/(app)/lib/db/listings.sql";
import { usersToBookingsTable } from "@/lib/db/schema.sql";
import { relations, sql } from "drizzle-orm";
import { integer, pgTable, date, pgEnum, check } from "drizzle-orm/pg-core";
import { getBookings } from "../api/queries";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const bookingStatusValues = [
  "Confirmed",
  "Pending",
  "Cancelled",
] as const;
export const bookingStatusEnum = pgEnum("booking_status", bookingStatusValues);

export const bookingsTable = pgTable(
  "bookings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    status: bookingStatusEnum().default("Pending"),
    checkIn: date().notNull(),
    checkOut: date().notNull(),
    guests: integer().notNull(),
    totalPrice: integer().notNull(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listingsTable.id),
  },
  (table) => [
    check("guests_check", sql`${table.guests} > 0`),
    check("totalPrice_check", sql`${table.totalPrice} > 0`),
  ],
);

export const bookingsRelation = relations(bookingsTable, ({ one }) => ({
  listing: one(listingsTable, {
    fields: [bookingsTable.listingId],
    references: [listingsTable.id],
  }),
  usersToBooking: one(usersToBookingsTable),
}));

export type Booking = typeof bookingsTable.$inferSelect;
export type BookingStatus = Booking["status"];
export type CompleteBooking = Awaited<ReturnType<typeof getBookings>>[0];

export const BookingInsertSchema = createInsertSchema(bookingsTable);
export const BookingUpdateSchema = createUpdateSchema(bookingsTable);
