export {
  listingsTable,
  listingsRelation,
} from "@/app/(app)/lib/db/listings.sql";
export {
  bookingsTable,
  bookingsRelation,
} from "@/app/(app)/listing/[listingId]/booking/lib/db/bookings.sql";
export {
  reviewsTable,
  reviewsRelation,
} from "@/app/(app)/listing/[listingId]/reviews/lib/db/reviews.sql";
export { usersTable, usersRelation } from "@/app/(auth)/lib/db/users.sql";
export { usersToBookingsTable, usersToBookingsRelation } from "./schema.sql";
