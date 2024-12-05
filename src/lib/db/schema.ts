import { sql } from "drizzle-orm";
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
  },
  (table) => [check("age_check", sql`${table.age} > 17`)],
);

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
    rating: real().notNull(),
    reviewCount: integer().default(0),
  },
  (table) => [
    check("price_check", sql`${table.price} > 0`),
    check("bedrooms_check", sql`${table.bedrooms} > 0`),
    check("rating_check", sql`${table.rating} BETWEEN 0 AND 5`),
  ],
);

export const reviewsTable = pgTable(
  "reviews",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    rating: real().notNull(),
    content: text().notNull(),
    author: text().notNull(),
    date: date().notNull(),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 0 AND 5`)],
);

export const bookingStatusEnum = pgEnum("booking_status", [
  "Confirmed",
  "Pending",
  "Cancelled",
]);

export const bookingsTable = pgTable(
  "bookings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    guestName: text().notNull(),
    status: bookingStatusEnum(),
    checkIn: date().notNull(),
    checkOut: date().notNull(),
    guests: integer().notNull(),
    totalPrice: integer().notNull(),
    amenities: text().notNull(),
    bnbName: text().notNull(),
    bnbAddress: text().notNull(),
    bnbPhone: text().notNull(),
    bnbEmail: text().notNull(),
  },
  (table) => [
    check("guests_check", sql`${table.guests} > 0`),
    check("totalPrice_check", sql`${table.totalPrice} > 0`),
  ],
);
