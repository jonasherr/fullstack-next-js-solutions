"use server";

import { ActionResponseType } from "@/lib/types/form";
import { redirect } from "next/navigation";
import {
  Booking,
  BookingInsertSchema,
  bookingsTable,
} from "../db/bookings.sql";
import { z, ZodFormattedError } from "zod";
import { db } from "@/lib/db";
import { listingsTable, usersToBookingsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
const today = new Date();
today.setHours(0, 0, 0, 0);

type PrevState = {
  errors: ZodFormattedError<Booking>;
  userId: number;
  type?: ActionResponseType;
};

export const bookListing = async (
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> => {
  let bookingId: number;
  let listingId: number;
  const userId = prevState.userId;
  try {
    const payload = Object.fromEntries(formData.entries());
    const adjustedPayload = {
      ...payload,
    };
    const {
      data: parsedFormData,
      success,
      error,
    } = BookingInsertSchema.omit({
      totalPrice: true,
      guests: true,
      listingId: true,
      status: true,
    })
      .merge(
        z.object({
          guests: z.coerce.number().min(1),
          listingId: z.coerce.number(),
          checkIn: z.coerce.date().refine((date) => date >= today, {
            message: "Check-in Datum muss heute oder in der Zukunft liegen.",
          }),
          checkOut: z.coerce.date().refine((date) => date >= today, {
            message: "Check-out Datum muss heute oder in der Zukunft liegen.",
          }),
        }),
      )
      .superRefine(({ checkIn, checkOut }, ctx) => {
        if (checkOut <= checkIn) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Check-out Datum muss in der Zukunft von Check-in liegen.",
            fatal: true,
            path: ["checkOut"],
          });
        }
      })
      .safeParse(adjustedPayload);

    if (!success) {
      const formattedErrors = error.format();
      return {
        type: ActionResponseType.error,
        errors: formattedErrors,
        userId,
      };
    }

    listingId = parsedFormData.listingId;
    const totalPrice = await getTotalPrice({
      checkIn: parsedFormData.checkIn,
      checkOut: parsedFormData.checkOut,
      listingId,
    });
    const insertData = {
      ...parsedFormData,
      totalPrice,
    };

    bookingId = await db.transaction(async (tx) => {
      const booking = await tx
        .insert(bookingsTable)
        // @ts-expect-error next-line type is correct and parsed
        .values(insertData)
        .returning({ bookingId: bookingsTable.id });
      const bookingId = booking[0].bookingId;

      const insertUserToBooking = {
        // TODO: wenn wir Authentication eingebaut haben, können wir die statische userId entfernen
        userId: 1,
        bookingId,
      };
      await tx.insert(usersToBookingsTable).values(insertUserToBooking);
      return bookingId;
    });
  } catch (error) {
    console.error(error);
    return {
      type: ActionResponseType.error,
      errors: { _errors: ["Ferienwohnung konnte nicht gebucht werden."] },
      userId,
    };
  }

  redirect(`/listing/${listingId}/booking/${bookingId}`);
};

const getTotalPrice = async ({
  checkIn,
  checkOut,
  listingId,
}: {
  checkIn: Date;
  checkOut: Date;
  listingId: number;
}) => {
  const durationOfStay = getDurationBetweenTwoDates({
    firstDate: new Date(checkIn),
    secondDate: new Date(checkOut),
  });

  const listing = await db
    .select({ price: listingsTable.price })
    .from(listingsTable)
    .where(eq(listingsTable.id, listingId));
  const pricePerNight = listing[0].price;
  return durationOfStay * pricePerNight;
};

const getDurationBetweenTwoDates = ({
  firstDate,
  secondDate,
}: {
  firstDate: Date;
  secondDate: Date;
}) => {
  const differenceInTime = firstDate.getTime() - secondDate.getTime();
  const differenceInDays = Math.abs(
    Math.round(differenceInTime / (1000 * 3600 * 24)),
  );

  return differenceInDays;
};
