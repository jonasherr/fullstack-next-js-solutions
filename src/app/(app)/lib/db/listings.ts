import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Listing } from "../types/listing";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const listingLocation = path.resolve(__dirname, "listings.json");

export const getListings = async () => {
  const content = await fs.readFile(listingLocation, "utf8");
  const listings: Listing[] = await JSON.parse(content);
  return listings;
};

export const updateListings = async (listings: Listing[]) => {
  await fs.writeFile(listingLocation, JSON.stringify(listings));
};
