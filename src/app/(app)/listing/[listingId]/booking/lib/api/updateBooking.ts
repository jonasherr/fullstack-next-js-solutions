"use server";

import { ActionResponseType } from "@/lib/types/form";
import {
  Booking,
  bookingsTable,
  BookingUpdateSchema,
  CompleteBooking,
} from "../db/bookings.sql";
import { z, ZodFormattedError } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
const today = new Date();
today.setHours(0, 0, 0, 0);

type PrevState = {
  errors: ZodFormattedError<Booking>;
  type?: ActionResponseType;
  data: CompleteBooking;
};

export const updateBooking = async (
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> => {
  let listingId: number;
  try {
    const payload = Object.fromEntries(formData.entries());
    const {
      data: parsedFormData,
      success,
      error,
    } = BookingUpdateSchema.merge(
      z.object({
        guests: z.coerce.number().min(1),
        listingId: z.coerce.number(),
        id: z.coerce.number(),
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
      .safeParse(payload);

    if (!success) {
      const formattedErrors = error.format();
      return {
        type: ActionResponseType.error,
        errors: formattedErrors,
        data: prevState.data,
      };
    }

    const { id: bookingId, ...updateData } = parsedFormData;

    await db
      .update(bookingsTable)
      // @ts-expect-error next-line type is correct and parsed, but face problems with parsed date
      .set(updateData)
      .where(eq(bookingsTable.id, bookingId));

    listingId = parsedFormData.listingId;
    revalidatePath(`/listing/${listingId}/booking`);
  } catch (error) {
    console.error(error);
    return {
      type: ActionResponseType.error,
      errors: { _errors: ["Ferienwohnung konnte nicht gebucht werden."] },
      data: prevState.data,
    };
  }

  redirect(`/listing/${listingId}/booking`);
};
