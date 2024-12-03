import { SingleListing } from "@/app/(app)/listing/[listingId]/components/single-listing";
import { Modal } from "@/components/modal";

export default async function InterceptedPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const title = `Listing ${listingId}`;
  return (
    <Modal title={title}>
      <SingleListing id={listingId} />
    </Modal>
  );
}
