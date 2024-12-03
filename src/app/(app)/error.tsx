"use client"; // müssen Client Components sein

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // Loggt den Fehler in eurem Loggin Tool (bspw. Sentry)
  }, [error]);

  return (
    <div className="bg-red-200 flex flex-col gap-10 p-8 rounded">
      <h1 className="text-lg font-mono">Irgendwas ist schief gelaufen!</h1>
      <button
        className="rounded px-4 py-2 bg-blue-500 mr-auto"
        onClick={
          () => reset() // Versucht Segment wiederherzustellen, indem es es neulädt
        }
      >
        Nochmal versuchen
      </button>
    </div>
  );
}
