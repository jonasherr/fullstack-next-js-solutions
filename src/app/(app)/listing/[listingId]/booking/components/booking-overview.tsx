"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pen, Trash } from "lucide-react";
import { CompleteBooking } from "../lib/db/bookings.sql";
import { useRouter } from "next/navigation";
import { Paths } from "@/lib/types/utils";
import { getNestedValue } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateBookingForm } from "./update-booking-form";
import { DialogDescription } from "@radix-ui/react-dialog";
import { deleteBooking } from "../lib/api/deleteBooking";
import { useToast } from "@/hooks/use-toast";
import { ActionResponseType } from "@/lib/types/form";

type BookingOverviewProps = {
  initialBookings: CompleteBooking[];
};
export default function BookingOverview({
  initialBookings,
}: BookingOverviewProps) {
  const [bookings, setBookings] = useState<CompleteBooking[]>(initialBookings);
  const [sortColumn, setSortColumn] =
    useState<Paths<CompleteBooking>>("checkIn");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const router = useRouter();
  const { toast } = useToast();

  const [openUpdateDialog, setOpenUpdateDialog] = useState<null | number>(null);
  const openedBooking = bookings.find((b) => b.id === openUpdateDialog);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<null | number>(null);
  const openedDeleteBooking = bookings.find((b) => b.id === openDeleteDialog);

  const sortBookings = (column: Paths<CompleteBooking>) => {
    const newDirection =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(newDirection);

    const sortedBookings = [...bookings].sort((a, b) => {
      const aValue = getNestedValue(a, column);
      const bValue = getNestedValue(b, column);

      if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setBookings(sortedBookings);
  };

  const SortIcon = ({ column }: { column: Paths<CompleteBooking> }) => {
    if (column !== sortColumn) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const closeDialogs = () => {
    setOpenUpdateDialog(null);
    setOpenDeleteDialog(null);
  };

  const handleDeleteBooking = async (bookingId: number) => {
    const response = await deleteBooking(bookingId);
    const isError = response.type === ActionResponseType.error;
    if (isError) {
      toast({
        title: "Fehler beim Löschen",
        description: "Irgendwas ist schief gegangen. Versuche es bitte erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Dialog
        open={openUpdateDialog !== null || openDeleteDialog !== null}
        onOpenChange={closeDialogs}
      >
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
                    onClick={() => sortBookings("usersToBooking.user.name")}
                  >
                    Gästename <SortIcon column="usersToBooking.user.name" />
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
                  <TableHead onClick={() => sortBookings("guests")}>
                    Gäste <SortIcon column="guests" />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => sortBookings("status")}
                  >
                    Status <SortIcon column="status" />
                  </TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    onClick={() =>
                      router.push(
                        `/listing/${booking.listingId}/booking/${booking.id}`,
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {booking.usersToBooking?.user.name}
                    </TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="circle"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenUpdateDialog(booking.id);
                        }}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="circle"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenDeleteDialog(booking.id);
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {openedBooking && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Buchung von Appartment {openedBooking.listing.name} Anpassen
              </DialogTitle>
              <DialogDescription>
                Passe die Buchung deines Gastes an.
              </DialogDescription>
              <UpdateBookingForm booking={openedBooking} />
            </DialogHeader>
          </DialogContent>
        )}
        {openedDeleteBooking && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Buchung vom {openedDeleteBooking.checkIn} -{" "}
                {openedDeleteBooking.checkIn}
              </DialogTitle>
              <DialogDescription>
                Bist du sicher, dass du die Buchung löschen möchtest?
                <br /> Das Löschen kann nicht rückgängig gemacht werden.
              </DialogDescription>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBooking(openedDeleteBooking.id)}
              >
                Löschen
              </Button>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
