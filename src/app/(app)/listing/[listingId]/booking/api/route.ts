import { NextResponse } from "next/server";
import { mockBookings } from "../lib/db/bookings";

export async function GET() {
  const bookings = mockBookings;

  return NextResponse.json(bookings);
}
