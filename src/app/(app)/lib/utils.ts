// TODO: Typ wird in der nächsten Übung angepasst
export const getRatingForListing = (listing: any) => {
  const sumOfReviews = listing.reviews.reduce(
    (curr, acc) => acc.rating + curr,
    0,
  );
  const averageOfReviews = sumOfReviews / listing.reviews.length;
  return parseFloat(averageOfReviews.toFixed(1));
};
