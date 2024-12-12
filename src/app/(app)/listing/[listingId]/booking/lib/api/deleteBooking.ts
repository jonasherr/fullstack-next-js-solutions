"use server";

import { bookingsTable } from "../db/bookings.sql";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ActionResponseType } from "@/lib/types/form";
import { usersToBookingsTable } from "@/lib/db/schema";

export const deleteBooking = async (bookingId: number) => {
  let listingId;
  try {
    const response = await db.transaction(async (tx) => {
      await tx
        .delete(usersToBookingsTable)
        .where(eq(usersToBookingsTable.bookingId, bookingId));
      const response = await tx
        .delete(bookingsTable)
        .where(eq(bookingsTable.id, bookingId))
        .returning({ listingId: bookingsTable.listingId });
      return response;
    });

    listingId = response[0].listingId;
    revalidatePath(`/listing/${listingId}/booking`);
  } catch (error) {
    console.error(error);

    return {
      type: ActionResponseType.error,
    };
  }

  redirect(`/listing/${listingId}/booking`);
};
