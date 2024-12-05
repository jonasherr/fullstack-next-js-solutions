import { db } from ".";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";
import { randomListingImages } from "./seed-data";

async function seedDB() {
  await reset(db, schema);
  await seed(db, schema, { count: 15, seed: 1 }).refine((f) => ({
    usersTable: {
      columns: {
        name: f.fullName(),
        age: f.int({ minValue: 18, maxValue: 90 }),
        phone: f.phoneNumber(),
      },
    },
    bookingsTable: {
      columns: {
        guestName: f.fullName(),
        guests: f.int({ minValue: 1, maxValue: 20 }),
        totalPrice: f.int({ minValue: 15000, maxValue: 300000 }),
        amenities: f.valuesFromArray({ values: ["Küche", "Wifi", "TV"] }),
      },
      with: {
        usersToBookingsTable: [
          { weight: 0.2, count: [1] },
          { weight: 0.4, count: [2] },
          { weight: 0.4, count: [4] },
        ],
      },
    },
    listingsTable: {
      columns: {
        description: f.loremIpsum({ sentencesCount: 3 }),
        image: f.valuesFromArray({
          values: randomListingImages,
          isUnique: true,
        }),
        price: f.weightedRandom([
          {
            weight: 0.7,
            value: f.int({ minValue: 15000, maxValue: 35000 }),
          },
          {
            weight: 0.3,
            value: f.int({ minValue: 100000, maxValue: 300000 }),
          },
        ]),
        bedrooms: f.int({ minValue: 1, maxValue: 10 }),
        rating: f.number({ minValue: 0, maxValue: 5, precision: 10 }),
        reviewCount: f.int({ minValue: 0, maxValue: 500 }),
        address: f.streetAddress(),
      },
    },
    reviewsTable: {
      columns: {
        title: f.loremIpsum({ sentencesCount: 1 }),
        rating: f.number({ minValue: 0, maxValue: 5, precision: 10 }),
        content: f.loremIpsum({ sentencesCount: 4 }),
        author: f.fullName(),
      },
    },
  }));
}

seedDB();
