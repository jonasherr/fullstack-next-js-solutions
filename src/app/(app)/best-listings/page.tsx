import { ListingsOverview } from "../components/listings";

export default function BestListingPage() {
  return (
    <div>
      <div className="grid gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-mono">
          Beste Ferienwohnungen
        </h1>

        <ListingsOverview />
      </div>
    </div>
  );
}
