import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workivo: Small task, Big relief | Home Services Powered by AWS & Supabase",
  description:
    "Trusted pros for the things you don't have time for. Book an electrician, a cook, a barber, a plumber, or movers right to your doorstep.",
  keywords: [
    "Workivo",
    "home services",
    "electrician at home",
    "cook",
    "barber",
    "plumbing",
    "packers and movers",
    "cleaning",
  ],
  authors: [{ name: "Workivo" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
