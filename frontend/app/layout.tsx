import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import GlobalBackButton from "@/components/GlobalBackButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IIT ISM CDC Placement Portal",
  description: "Career Development Centre — Placement Portal for IIT (ISM) Dhanbad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ThemeRegistry>
          <GlobalBackButton />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
