import { getUserAuth } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserAuth();
  if (session) redirect("/");
  return (
    <div className="h-full bg-white">
      <div className="h-full">{children}</div>
    </div>
  );
}
