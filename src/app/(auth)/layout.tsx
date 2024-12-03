export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-white">
      <div className="h-full">{children}</div>
    </div>
  );
}
