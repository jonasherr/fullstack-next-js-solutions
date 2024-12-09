import { listingsTable } from "../db/listings.sql";

export type Listing = typeof listingsTable.$inferSelect;
