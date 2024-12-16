"use client";

import logo from "@/assets/next.svg";
import Image from "next/image";
import Link from "next/link";
import { createUser } from "../lib/api/createUser";
import { useActionState } from "react";
import { ActionResponseType } from "@/lib/types/form";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [state, formAction] = useActionState(createUser, {
    errors: { _errors: [] },
    type: ActionResponseType.success,
  });
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image alt="Your Company" src={logo} className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Registrieren
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action={formAction} className="space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />

            {state.errors.email && (
              <p className="text-red-500">
                {state.errors.email._errors.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required autoComplete="name" />

            {state.errors.name && (
              <p className="text-red-500">
                {state.errors.name._errors.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" required />

            {state.errors.age && (
              <p className="text-red-500">
                {state.errors.age._errors.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input id="phone" name="phone" required autoComplete="tel" />

            {state.errors.phone && (
              <p className="text-red-500">
                {state.errors.phone._errors.join(", ")}
              </p>
            )}
          </div>

          <div>
            <Button type="submit">Registrieren</Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Schon Mitglied?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
