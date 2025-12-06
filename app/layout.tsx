import type { Metadata } from "next";
import "./globals.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Agro Proposals",
  description: "Agricultural proposal management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
