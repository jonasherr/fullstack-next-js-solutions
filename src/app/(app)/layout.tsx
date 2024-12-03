import { Navigation } from "@/components/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
      <Navigation />
      {children}
      <div id="modal-root" />
    </div>
  );
}
