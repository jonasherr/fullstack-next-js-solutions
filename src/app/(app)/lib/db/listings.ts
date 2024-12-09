import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Listing } from "../types/listing";
import { db } from "@/lib/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const listingLocation = path.resolve(__dirname, "listings.json");

export const getListings = async () => {
  return await db.query.listingsTable.findMany({
    with: { reviews: true },
  });
};

export const updateListings = async (listings: Listing[]) => {
  await fs.writeFile(listingLocation, JSON.stringify(listings));
};
