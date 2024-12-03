import type { Metadata } from "next";
import { getListings } from "../../lib/db/listings";
import { SingleListing } from "./components/single-listing";

type ListingDetailPageProps = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const id = (await params).listingId;
  const listings = await getListings();

  const listing = listings.find((l) => l.id === parseInt(id));

  return {
    title: listing?.name,
    description: listing?.description,
  };
}

export async function generateStaticParams() {
  const listings = [{ id: "1" }, { id: "2" }, { id: "3" }];

  return listings.map((listing) => ({
    listingId: listing.id,
  }));
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { listingId } = await params;

  if (listingId === "2") {
    throw new Error();
  }

  return <SingleListing id={listingId} />;
}
