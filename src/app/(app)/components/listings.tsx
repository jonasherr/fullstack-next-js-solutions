import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getListings } from "../lib/db/listings";

export async function ListingsOverview() {
  const listings = await getListings();
  return (
    <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing, index) => (
        <Link
          href={`/listing/${listing.id}`}
          key={listing.id}
          className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 relative">
            <Image
              alt={`Ferienhaus ${listing.name}`}
              src={listing.images[0]}
              priority={index < 9}
              fill
              // vw bei Sizes habe ich etwas größer als nötig gemacht, da sonst die Qualität zu gering war
              sizes="(max-width: 767px) 70vw, (max-width: 1023px) 50vw, 40vw"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="pb-4 pt-10 text-center">
            <h3 className="text-sm font-medium text-gray-900">
              <p>
                <span aria-hidden="true" className="absolute inset-0" />
                {listing.name}
              </p>
            </h3>
            <div className="mt-3 flex flex-col items-center">
              <p className="sr-only">{listing.rating} von 5 Sternen</p>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    fill={listing.rating > rating ? "#facc15" : "#e5e7eb"}
                    className={cn(
                      listing.rating > rating
                        ? "text-yellow-400"
                        : "text-gray-200",
                      "h-5 w-5 shrink-0",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {listing.reviewCount} Bewertungen
              </p>
            </div>
            <p className="mt-4 text-base font-medium text-gray-900">
              {listing.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
