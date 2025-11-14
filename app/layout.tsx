import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Dashboard",
  description: "Apple-style minimalist daily task dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sf antialiased">{children}</body>
    </html>
  );
}
