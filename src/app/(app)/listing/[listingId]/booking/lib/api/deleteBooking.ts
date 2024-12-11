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
    // TODO: das erste Löschen soll nur ausgeführt werden, wenn das zweite auch funktioniert
    // das lösen wir sobald wir Transactions kennenlernen
    await db
      .delete(usersToBookingsTable)
      .where(eq(usersToBookingsTable.bookingId, bookingId));
    const response = await db
      .delete(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .returning({ listingId: bookingsTable.listingId });

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
