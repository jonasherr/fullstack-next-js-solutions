import { NextResponse } from "next/server";
import { getBookings } from "./queries";

export async function GET() {
  const bookings = getBookings();

  return NextResponse.json(bookings);
}
