import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FreshKits — Quick & Easy Meal Kits for Busy Families",
    template: "%s | FreshKits",
  },
  description:
    "FreshKits delivers fresh, pre-measured ingredients straight to your door. Stress-free dinners ready in 20 minutes for busy families.",
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
