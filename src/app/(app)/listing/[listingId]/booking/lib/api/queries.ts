import { db } from "@/lib/db";
import { Booking } from "../db/bookings.sql";

export const getBookings = async () => {
  return db.query.bookingsTable.findMany({
    with: {
      listing: true,
      usersToBooking: {
        with: {
          user: true,
        },
      },
    },
  });
};

export const getBooking = async (id: Booking["id"]) => {
  return db.query.bookingsTable.findFirst({
    where: (bookingsTable, { eq }) => eq(bookingsTable.id, id),
    with: {
      listing: true,
      usersToBooking: {
        with: {
          user: true,
        },
      },
    },
  });
};
