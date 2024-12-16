"use server";

import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export const login = async (formData: FormData) => {
  try {
    await signIn("credentials", formData, { redirectTo: "/" });
  } catch (error) {
    if (isRedirectError(error)) throw error;
  }
};
