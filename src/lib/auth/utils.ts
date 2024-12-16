"use server";

import { redirect } from "next/navigation";
import { auth } from ".";
import { hash } from "@node-rs/argon2";

export const getUserAuth = async () => {
  const session = await auth();
  return session;
};

export const checkAuth = async () => {
  const session = await getUserAuth();
  if (!session) redirect("/login");
};

export async function saltAndHashPassword(password: string) {
  return await hash(password);
}

export const getOwnerId = async () => {
  const session = await getUserAuth();
  if (!session?.user) redirect("/login");
  return session.user.id;
};
