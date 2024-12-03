export enum BookingStatus {
  "Confirmed",
  "Pending",
  "Cancelled",
}

export interface Booking {
  id: string;
  guestName: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  amenities: string[];
  bnbName: string;
  bnbAddress: string;
  bnbPhone: string;
  bnbEmail: string;
}
