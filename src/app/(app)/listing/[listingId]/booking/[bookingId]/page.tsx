import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  CalendarDays,
  Users,
  Phone,
  Mail,
  MapPin,
  ChefHat,
  Wifi,
  TvMinimal,
} from "lucide-react";
import { getBooking } from "../lib/api/queries";

type BookingPageProps = {
  params: Promise<{
    bookingId: string;
  }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { bookingId } = await params;
  const booking = await getBooking(parseInt(bookingId));

  if (!booking) throw new Error("Buchung konnte nicht gefunden werden");

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Buchungsbestätigung
          </CardTitle>
          <CardDescription className="text-center">
            Danke dass Sie sich für {booking.listing.name} entschieden haben
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Buchungsdetails</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Buchungs ID</TableCell>
                    <TableCell>{booking.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Name des Gastes
                    </TableCell>
                    <TableCell>{booking.usersToBooking?.user.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Check-in
                      </div>
                    </TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Check-out
                      </div>
                    </TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Gäste
                      </div>
                    </TableCell>
                    <TableCell>{booking.guests}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gesamtpreis</TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <ul className="flex flex-wrap gap-2">
                {booking.listing.kitchen && (
                  <li className="flex items-center gap-2">
                    <ChefHat /> Küche
                  </li>
                )}
                {booking.listing.tv && (
                  <li className="flex items-center gap-2">
                    <Wifi /> W-Lan
                  </li>
                )}
                {booking.listing.wifi && (
                  <li className="flex items-center gap-2">
                    <TvMinimal /> Fernseher
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">B&B Informationen</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="font-semibold text-lg mb-2">
                    {booking.listing.name}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {booking.listing.address}
                    </p>
                    {booking.usersToBooking?.user && (
                      <>
                        {booking.usersToBooking.user.phone && (
                          <p className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" />
                            {booking.usersToBooking?.user.phone}
                          </p>
                        )}
                        <p className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          {booking.usersToBooking?.user.email}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
