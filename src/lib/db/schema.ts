import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  date,
  real,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";

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

export const bookingStatusEnum = pgEnum("booking_status", [
  "Confirmed",
  "Pending",
  "Cancelled",
]);

export const bookingsTable = pgTable(
  "bookings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    status: bookingStatusEnum(),
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
