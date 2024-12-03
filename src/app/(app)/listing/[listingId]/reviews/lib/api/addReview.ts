"use server";

import { getListings, updateListings } from "@/app/(app)/lib/db/listings";
import { Listing } from "@/app/(app)/lib/types/listing";
import { ActionResponseType } from "@/lib/types/form";
import { wait } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Review } from "../../components/reviews";

export const addReview = async (
  prevState: { message: string; userId: string; type?: ActionResponseType },
  formData: FormData,
) => {
  const userId = prevState.userId;
  let listingId: Listing["id"] | undefined;

  try {
    listingId = formData.get("listingId") as unknown as Listing["id"];
    if (typeof listingId !== "string")
      throw new Error("listing id should be of type string");

    const listings = await getListings();
    const listing = listings.find((l) => l.id === listingId);

    if (!listing) throw new Error("cannot find listing");

    const newId = crypto.randomUUID();
    const review: Review = {
      id: newId,
      rating: parseInt(formData.get("rating") as string),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      author: formData.get("name") as string,
      date: new Date().toLocaleDateString("de-de"),
    };
    listing.reviews.push(review);

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
