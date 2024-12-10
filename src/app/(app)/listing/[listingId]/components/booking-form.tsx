"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookListing } from "../lib/api/bookListing";
import { useActionState } from "react";
import { ActionResponseType } from "@/lib/types/form";

type BookingFormProps = {
  userId: number;
  listingId: string;
};
export const BookingForm = ({ userId, listingId }: BookingFormProps) => {
  const [state, formAction] = useActionState(bookListing, {
    message: "",
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
          <Label htmlFor="startDate">Startdatum</Label>
          <Input type="date" id="startDate" name="startDate" />
        </div>

        <div>
          <Label htmlFor="endDate">Enddatum</Label>
          <Input type="date" id="endDate" name="endDate" />
        </div>
      </div>

      <Label htmlFor="name">Name</Label>
      <Input type="text" id="name" name="name" />

      <Label htmlFor="guests">Gäste</Label>
      <Input type="number" min={1} id="guests" name="guests" />

      {state.message && (
        <p
          className={
            state.type === ActionResponseType.success
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {state.message}
        </p>
      )}

      <input hidden readOnly name="listingId" value={listingId} />

      <Button>Reservieren</Button>
    </form>
  );
};
