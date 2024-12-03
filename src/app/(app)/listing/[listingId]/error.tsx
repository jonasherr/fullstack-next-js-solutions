"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-red-200 flex flex-col gap-10 p-8 rounded">
      <h1 className="text-lg font-mono">Irgendwas ist schief gelaufen!</h1>
      <Link className="rounded px-4 py-2 bg-blue-500 mr-auto" href="/">
        Zurück zu allen Ferienhäusern
      </Link>
    </div>
  );
}
