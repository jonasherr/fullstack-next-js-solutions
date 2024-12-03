import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = (timeout?: number) =>
  new Promise((resolve) =>
    setTimeout(() => resolve("finished"), timeout ?? 5000),
  );
