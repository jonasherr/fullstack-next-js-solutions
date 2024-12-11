import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActionResponseType } from "@/lib/types/form";
import { useActionState } from "react";
import { updateBooking } from "../lib/api/updateBooking";
import { bookingStatusValues, CompleteBooking } from "../lib/db/bookings.sql";

type UpdateBookingForm = {
  booking: CompleteBooking;
};
export const UpdateBookingForm = ({ booking }: UpdateBookingForm) => {
  const [state, formAction] = useActionState(updateBooking, {
    data: booking,
    errors: { _errors: [] },
    type: ActionResponseType.pending,
  });

  return (
    <form
      className="mt-4 grid w-full max-w-sm items-center gap-1.5"
      action={formAction}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <div>
          <Label htmlFor="checkIn">Check-in</Label>
          <Input
            type="date"
            id="checkIn"
            name="checkIn"
            defaultValue={state.data.checkIn}
          />
          {state.errors.checkIn && (
            <p className="text-red-500">
              {state.errors.checkIn._errors.join(", ")}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="checkOut">Check-out</Label>
          <Input
            type="date"
            id="checkOut"
            name="checkOut"
            defaultValue={state.data.checkOut}
          />
          {state.errors.checkOut && (
            <p className="text-red-500">
              {state.errors.checkOut._errors.join(", ")}
            </p>
          )}
        </div>
      </div>

      <Label htmlFor="guests">Gäste</Label>
      <Input
        type="number"
        min={1}
        id="guests"
        name="guests"
        defaultValue={state.data.guests}
      />
      {state.errors.guests && (
        <p className="text-red-500">{state.errors.guests._errors.join(", ")}</p>
      )}

      <Label htmlFor="status">Status</Label>
      <Select name="status" defaultValue={state.data.status ?? "Pending"}>
        <SelectTrigger>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {bookingStatusValues.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input hidden name="listingId" defaultValue={state.data.listingId} />
      <input hidden name="id" defaultValue={state.data.id} />

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

      <Button>Anpassen</Button>
    </form>
  );
};
