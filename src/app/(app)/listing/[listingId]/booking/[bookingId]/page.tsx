import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Phone, Mail, MapPin } from "lucide-react";
import { Booking, BookingStatus } from "../lib/types/booking";

const mockBooking: Booking = {
  id: "BK12345",
  status: BookingStatus.Confirmed,
  guestName: "John Doe",
  checkIn: "2023-12-15",
  checkOut: "2023-12-20",
  guests: 2,
  totalPrice: 750,
  amenities: [
    "Free Wi-Fi",
    "Breakfast Included",
    "Mountain View",
    "Private Bathroom",
  ],
  bnbName: "Cozy Mountain Retreat",
  bnbAddress: "123 Pine Lane, Mountain Town, MT 12345",
  bnbPhone: "+1 (555) 123-4567",
  bnbEmail: "info@cozymountainretreat.com",
};

export default function BookingConfirmation() {
  const booking = mockBooking;

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Buchungsbestätigung
          </CardTitle>
          <CardDescription className="text-center">
            Danke dass Sie sich für {booking.bnbName} entschieden haben
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
                    <TableCell>{booking.guestName}</TableCell>
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
              <div className="flex flex-wrap gap-2">
                {booking.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">B&B Informationen</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="font-semibold text-lg mb-2">
                    {booking.bnbName}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {booking.bnbAddress}
                    </p>
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {booking.bnbPhone}
                    </p>
                    <p className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {booking.bnbEmail}
                    </p>
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
