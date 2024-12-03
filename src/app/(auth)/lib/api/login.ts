"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async () => {
  const cookieStore = await cookies();

  cookieStore.set("auth", "yay!");

  redirect("/");
};
