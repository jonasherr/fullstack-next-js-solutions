"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Booking, BookingStatus } from "./lib/types/booking";
import { mockBookings } from "./lib/db/bookings";
import { useParams, useRouter } from "next/navigation";

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [sortColumn, setSortColumn] = useState<keyof Booking>("checkIn");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const router = useRouter();
  const params = useParams<{ listingId: string }>();
  const listingId = parseInt(params.listingId);

  const sortBookings = (column: keyof Booking) => {
    const newDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedBookings = [...bookings].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setBookings(sortedBookings);
  };

  const SortIcon = ({ column }: { column: keyof Booking }) => {
    if (column !== sortColumn) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Buchungsübersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => sortBookings("guestName")}
                >
                  Gästename <SortIcon column="guestName" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => sortBookings("checkIn")}
                >
                  Check-in <SortIcon column="checkIn" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => sortBookings("checkOut")}
                >
                  Check-out <SortIcon column="checkOut" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => sortBookings("guests")}
                >
                  Gäste <SortIcon column="guests" />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => sortBookings("status")}
                >
                  Status <SortIcon column="status" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/listing/${listingId}/booking/${booking.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {booking.guestName}
                  </TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${
                        booking.status === BookingStatus.Confirmed
                          ? "bg-green-100 text-green-800"
                          : booking.status === BookingStatus.Pending
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
