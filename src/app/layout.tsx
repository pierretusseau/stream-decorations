import type { Metadata } from "next";
import { Geist, Geist_Mono, Teko } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
// import { getServerSession } from "next-auth";
// import { authOptions } from '@/app/api/auth/nextauth/route'
// import Provider from "@/lib/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const teko = Teko({
  subsets: ['latin'],
  variable: "--font-teko",
  display: 'swap',
})
const MHNumbers = localFont({
  src: './MH_NormalNumbers.ttf',
  variable: "--font-mhn",
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Stream Decorations",
  description: "A Web App to handle OBS Browser for streaming",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authOptions) as TwitchSession;

  const fonts = [
    geistSans.variable,
    geistMono.variable,
    teko.variable,
    MHNumbers.variable
  ].join(' ')

  return (
    <html lang="en">
      <body
        className={`${fonts} antialiased`}
      >
        {/* <Provider session={session}>{children}</Provider> */}
        {children}
      </body>
    </html>
  );
}
