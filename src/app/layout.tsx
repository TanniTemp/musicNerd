import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
title: "Music Nerd",
  description: "Guess the song game site where you can test your music knowledge.",
  keywords: ["music quiz", "guess the song", "track recognition", "Music Nerd", "music trivia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="ZjahkfyLgxfprxUczYK7nztv4E77-JQxPmZYThPdGMI" />
    
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
