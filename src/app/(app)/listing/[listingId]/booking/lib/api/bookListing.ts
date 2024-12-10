"use server";

import { ActionResponseType } from "@/lib/types/form";
import { z, ZodFormattedError } from "zod";
import { Booking, BookingInsertSchema } from "../db/bookings.sql";
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
  const userId = prevState.userId;
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

  console.log(parsedFormData);

  return {
    type: ActionResponseType.error,
    errors: { _errors: ["Ferienwohnung konnte nicht gebucht werden."] },
    userId,
  };
};
