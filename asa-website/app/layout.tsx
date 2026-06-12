import type { Metadata } from "next";
import { Playfair_Display, Lato, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ['latin'],
  style: ['italic', 'normal']
})

const lato = Lato({
  weight: ['300', '400', '700'],
  variable: "--font-lato",
  subsets: ['latin']
})

const cormorant = Cormorant_Garamond({
  weight:['300', '400', '500'],
  style:['normal', 'italic'],
  variable: "--font-cormorant",
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "ASA of UNLV",
  description: "Armenian Student Association - University of Nevada, Las Vegas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lato.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
