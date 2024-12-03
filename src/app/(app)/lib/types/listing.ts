import { Review } from "../../listing/[listingId]/reviews/components/reviews";

export type Listing = {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  properties: { kitchen: boolean; wifi: boolean; tv: boolean };
  bedrooms: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
};
