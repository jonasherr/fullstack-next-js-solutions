"use client";

import { cn } from "@/lib/utils";
import { Loader, StarIcon } from "lucide-react";
import React, { useOptimistic } from "react";
import { ReviewForm } from "./review-form";
import { Review } from "../lib/db/reviews.sql";

type ReviewsProps = {
  reviews: Review[];
  listingId: string;
};

export const Reviews = ({ reviews, listingId }: ReviewsProps) => {
  const reviewsWithSendingState: { review: Review; sending?: boolean }[] =
    reviews.map((review) => ({ review }));
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviewsWithSendingState,
    (state, newReview: Review) => [
      ...state,
      {
        review: newReview,
        sending: true,
      },
    ],
  );

  return (
    <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-24">
      <h2 id="reviews-heading" className="text-lg font-medium text-gray-900">
        Neuste Bewertungen
      </h2>

      <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
        {optimisticReviews.map(({ review, sending }) => (
          <div
            key={review.id}
            className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
          >
            <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
              <div className="flex items-center xl:col-span-1">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      fill={review.rating > rating ? "#facc15" : "#e5e7eb"}
                      className={cn(
                        review.rating > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 shrink-0",
                      )}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  {review.rating}
                  <span className="sr-only"> out of 5 stars</span>
                </p>

                {sending && <Loader className="ml-2 animate-spin" />}
              </div>

              <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {review.title}
                </h3>

                <div
                  dangerouslySetInnerHTML={{ __html: review.content }}
                  className="mt-3 space-y-6 text-sm text-gray-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
              <p className="font-medium text-gray-900">{review.userId}</p>
              <time className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0">
                {review.date}
              </time>
            </div>
          </div>
        ))}
      </div>

      <ReviewForm
        userId="123d"
        addOptimistic={addOptimisticReview}
        listingId={listingId}
      />
    </section>
  );
};
