"use server";

import { getUserFromDb, saltAndHashPassword } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { InsertUserSchema, User, usersTable } from "../db/users.sql";
import { z, ZodFormattedError } from "zod";
import { ActionResponseType } from "@/lib/types/form";
import { signIn } from "@/lib/auth";

type PrevState = {
  errors: ZodFormattedError<User>;
  type?: ActionResponseType;
  data?: User;
};

export const createUser = async (
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> => {
  try {
    const payload = Object.fromEntries(formData.entries());
    const {
      data: newUser,
      success,
      error,
    } = InsertUserSchema.merge(
      z.object({ age: z.coerce.number().min(18) }),
    ).safeParse(payload);

    if (!success) {
      const formattedErrors = error.format();
      return {
        type: ActionResponseType.error,
        errors: formattedErrors,
        data: prevState.data,
      };
    }

    const existingUser = await getUserFromDb(newUser.email);
    if (!!existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await saltAndHashPassword(newUser.password);
    const newUserWithHashedPassword = { ...newUser, password: passwordHash };
    await db
      .insert(usersTable)
      .values(newUserWithHashedPassword)
      .returning({ id: usersTable.id, email: usersTable.email });

    return await signIn(
      "credentials",
      { email: newUser.email, password: newUser.password },
      { redirectTo: "/" },
    );
  } catch (err) {
    console.error(err);
    return {
      type: ActionResponseType.error,
      errors: { _errors: ["Account konnte nicht erstellt werden."] },
      data: prevState.data,
    };
  }
};
