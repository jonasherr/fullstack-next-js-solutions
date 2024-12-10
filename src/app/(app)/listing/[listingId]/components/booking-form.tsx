"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookListing } from "../booking/lib/api/bookListing";
import { useActionState } from "react";
import { ActionResponseType } from "@/lib/types/form";

type BookingFormProps = {
  userId: number;
  listingId: string;
};
export const BookingForm = ({ userId, listingId }: BookingFormProps) => {
  const [state, formAction] = useActionState(bookListing, {
    errors: { _errors: [] },
    userId,
    type: ActionResponseType.success,
  });

  return (
    <form
      className="mt-4 grid w-full max-w-sm items-center gap-1.5"
      action={formAction}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input type="date" id="checkIn" name="checkIn" />
          {state.errors.checkIn && (
            <p className="text-red-500">
              {state.errors.checkIn._errors.join(", ")}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input type="date" id="checkOut" name="checkOut" />
          {state.errors.checkOut && (
            <p className="text-red-500">
              {state.errors.checkOut._errors.join(", ")}
            </p>
          )}
        </div>
      </div>

      <Label htmlFor="guests">Gäste</Label>
      <Input type="number" min={1} id="guests" name="guests" />
      {state.errors.guests && (
        <p className="text-red-500">{state.errors.guests._errors.join(", ")}</p>
      )}

      {state.errors._errors.length !== 0 && (
        <p
          className={
            state.type === ActionResponseType.success
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {state.errors._errors.join(", ")}
        </p>
      )}

      <input hidden readOnly name="listingId" value={listingId} />

      <Button>Reservieren</Button>
    </form>
  );
};
