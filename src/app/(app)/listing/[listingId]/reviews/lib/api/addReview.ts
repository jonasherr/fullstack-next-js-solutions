"use server";

import { getListings, updateListings } from "@/app/(app)/lib/db/listings";
import { Listing } from "@/app/(app)/lib/types/listing";
import { ActionResponseType } from "@/lib/types/form";
import { wait } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { InsertReview, Review } from "../../reviews/lib/db/reviews.sql";

export const addReview = async (
  prevState: { message: string; userId: string; type?: ActionResponseType },
  formData: FormData,
) => {
  const userId = prevState.userId;
  let listingId: Listing["id"] | undefined;

  try {
    listingId = parseInt(formData.get("listingId") as string) as Listing["id"];
    if (typeof listingId !== "number")
      throw new Error("listing id should be of type number");

    const listings = await getListings();
    const listing = listings.find((l) => l.id === listingId);

    if (!listing) throw new Error("cannot find listing");

    const review: InsertReview = {
      rating: parseInt(formData.get("rating") as string),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      date: new Date().toLocaleDateString("de-de"),
      listingId: 0,
      userId: 0,
    };
    listing.reviews.push(review as Review);

    await wait(2000);
    await updateListings(listings);

    return {
      type: ActionResponseType.success,
      message: "Kommentar wurde hinzugefügt.",
      userId,
    };
  } catch (error) {
    console.error(error);

    return {
      type: ActionResponseType.error,
      message: "Kommentar konnte nicht hinzugefügt werden.",
      userId,
    };
  } finally {
    if (listingId) {
      revalidatePath(`/listing/${listingId}`);
    }
  }
};
