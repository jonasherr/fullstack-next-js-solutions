import { ListingsOverview } from "./components/listings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferienwohnungen",
  description: "Buche eine Unterkunft für jede Art von Reise",
};

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-mono">
        Ferienwohnungen
      </h1>

      <ListingsOverview />
    </div>
  );
}
