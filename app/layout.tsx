import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meal Kits – Quick & Easy Dinners for Busy Families",
  description:
    "Stress-free dinners ready in minutes. Discover our back-to-school meal kits for busy families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
