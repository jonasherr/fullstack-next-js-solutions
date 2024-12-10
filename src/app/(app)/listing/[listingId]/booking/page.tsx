import BookingOverview from "./components/booking-overview";
import { getBookings } from "./lib/api/queries";

export default async function BookingPage() {
  const bookings = await getBookings();
  return <BookingOverview initialBookings={bookings} />;
}
