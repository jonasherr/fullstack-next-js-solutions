"use server";

import { ActionResponseType } from "@/lib/types/form";
import { redirect } from "next/navigation";

export const bookListing = async (
  prevState: { message: string; userId: string; type?: ActionResponseType },
  formData: FormData,
) => {
  const userId = prevState.userId;

  for (const [key, value] of formData) {
    console.log(key, value);
  }
  console.log("userId", userId);

  const name = formData.get("name");
  if (name !== "Jonas") {
    return {
      type: ActionResponseType.error,
      message:
        "Die Ferienwohnung ist für diesen Zeitraum leider schon gebucht.",
      userId,
    };
  }

  const listingId = formData.get("listingId");

  if (typeof listingId !== "string") {
    return {
      type: ActionResponseType.error,
      message: "Ferienwohnung konnte nicht gebucht werden.",
      userId,
    };
  }

  redirect(`/listing/${listingId}/booking/1`);
};
