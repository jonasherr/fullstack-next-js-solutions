import { checkAuth } from "@/lib/auth/utils";
import { Navigation } from "@components/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
      <Navigation />
      {children}
      <div id="modal-root" />
    </div>
  );
}
