import { db } from ".";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";
import { randomListingImages } from "./seed-data";

async function seedDB() {
  await reset(db, schema);
  await seed(db, schema, { count: 5, seed: 1 }).refine((f) => ({
    usersTable: {
      columns: {
        name: f.fullName(),
        age: f.int({ minValue: 18, maxValue: 90 }),
      },
    },
    bookingsTable: {
      columns: {
        guestName: f.fullName(),
        guests: f.int({ minValue: 1, maxValue: 20 }),
        totalPrice: f.int({ minValue: 15000, maxValue: 300000 }),
        amenities: f.valuesFromArray({ values: ["Küche", "Wifi", "TV"] }),
        bnbName: f.loremIpsum({ sentencesCount: 1 }),
        bnbAddress: f.streetAddress(),
        bnbPhone: f.phoneNumber(),
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
