import { cn } from "@/lib/utils";
import { ChefHat, StarIcon, TvMinimal, Wifi } from "lucide-react";
import Image from "next/image";
import { BookingForm } from "./booking-form";
import { Reviews } from "../reviews/components/reviews";
import { getListing } from "@/app/(app)/lib/db/queries";
import { getRatingForListing } from "@/app/(app)/lib/utils";

export const revalidate = 60 * 60 * 1;

export async function SingleListing({ id }: { id: string }) {
  const listing = await getListing(parseInt(id));
  if (!listing) throw new Error("Ferienwohnung konnte nicht gefunden werden");

  const rating = getRatingForListing(listing);

  return (
    <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
      <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="flex justify-between">
            <h1 className="text-xl font-medium text-gray-900 font-mono">
              {listing.name}
            </h1>
            <p className="text-xl font-medium text-gray-900">
              {listing.price}€
            </p>
          </div>
          {/* Reviews */}
          <div className="mt-4">
            <h2 className="sr-only">Reviews</h2>
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                {rating}
                <span className="sr-only"> von 5 Sternen</span>
              </p>
              <div className="ml-1 flex items-center">
                {[0, 1, 2, 3, 4].map((star) => (
                  <StarIcon
                    key={star}
                    aria-hidden="true"
                    fill={rating > star ? "#facc15" : "#e5e7eb"}
                    className={cn(
                      rating > star ? "text-yellow-400" : "text-gray-200",
                      "h-5 w-5 shrink-0",
                    )}
                  />
                ))}
              </div>
              <div aria-hidden="true" className="ml-4 text-sm text-gray-300">
                ·
              </div>
              <div className="ml-4 flex">
                <a
                  href="#reviews-heading"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Siehe alle {listing.reviews.length} Bewertungen
                </a>
              </div>
            </div>
          </div>
          <BookingForm userId={listing.userId} listingId={id} />
        </div>

        {/* Image gallery */}
        <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
          <h2 className="sr-only">Images</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
            <div className="lg:col-span-2 lg:row-span-2 aspect-square overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 relative">
              <Image
                alt={listing.name}
                src={listing.image}
                priority
                fill
                sizes="(max-width: 1023px) 50vw, 90vw"
                className="rounded-lg object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 lg:col-span-5">
          {/* Product details */}
          <div className="mt-10">
            <h2 className="text-sm font-medium text-gray-900">Beschreibung</h2>

            <p className="prose prose-sm mt-4 text-gray-500">
              {listing.description}
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-sm font-medium text-gray-900">
              Das bietet dir diese Unterkunft
            </h2>

            <div className="prose prose-sm mt-4 text-gray-500">
              <ul role="list" className="flex flex-col gap-1">
                {listing.kitchen && (
                  <li className="flex items-center gap-2">
                    <ChefHat /> Küche
                  </li>
                )}
                {listing.wifi && (
                  <li className="flex items-center gap-2">
                    <Wifi /> W-Lan
                  </li>
                )}
                {listing.tv && (
                  <li className="flex items-center gap-2">
                    <TvMinimal /> Fernseher
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Reviews reviews={listing.reviews} listingId={id} />
    </main>
  );
}
