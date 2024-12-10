import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Paths } from "./types/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = (timeout?: number) =>
  new Promise((resolve) =>
    setTimeout(() => resolve("finished"), timeout ?? 5000),
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNestedValue = <T>(obj: T, path: Paths<T>): any => {
  return path
    .split(".")
    .reduce((value, key) => (value ? value[key] : undefined), obj);
};
