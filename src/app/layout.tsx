import type { Metadata } from "next";
import { Inter, Poppins, Squada_One } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-poppins",
});
const squadaone = Squada_One({
  subsets: ["latin"],
  weight: ['400'],
  variable: "--font-squadaone",
});

export const metadata: Metadata = {
  title: "PrimeDrive",
  description: "Experience the thrill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${squadaone.variable} font-poppins bg-gray-100 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}