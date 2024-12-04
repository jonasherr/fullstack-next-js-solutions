import {
  boolean,
  integer,
  pgTable,
  text,
  date,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
});

export const listingsTable = pgTable("listings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  price: integer().notNull(),
  images: text().notNull(),
  description: text().notNull(),
  kitchen: boolean().notNull(),
  wifi: boolean().notNull(),
  tv: boolean().notNull(),
  bedrooms: integer().notNull(),
  rating: integer(),
  reviewCount: integer().default(0),
});

export const reviewsTable = pgTable("reviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  rating: real().notNull(),
  content: text().notNull(),
  author: text().notNull(),
  date: date().notNull(),
});

export const bookingStatusEnum = pgEnum("booking_status", [
  "Confirmed",
  "Pending",
  "Cancelled",
]);

export const bookingsTable = pgTable("bookings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  guestName: text().notNull(),
  status: bookingStatusEnum(),
  checkIn: text().notNull(),
  checkOut: text().notNull(),
  guests: integer().notNull(),
  totalPrice: integer().notNull(),
  amenities: text().notNull(),
  bnbName: text().notNull(),
  bnbAddress: text().notNull(),
  bnbPhone: text().notNull(),
  bnbEmail: text().notNull(),
});
