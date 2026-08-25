import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ContourBackground from "@/components/ui/ContourBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Albin Reji | Full Stack Developer",
  description:
    "Full Stack Developer specializing in Java, Spring Boot, React, microservices, secure APIs, and scalable web applications.",
  keywords: [
    "Albin Reji",
    "Full Stack Developer",
    "Java",
    "Spring Boot",
    "React",
    "Microservices",
    "Software Engineer",
  ],
  authors: [{ name: "Albin Reji" }],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Albin Reji | Full Stack Developer",
    description:
      "Full Stack Developer specializing in Java, Spring Boot, React, microservices, secure APIs, and scalable web applications.",
    siteName: "Albin Reji Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albin Reji | Full Stack Developer",
    description:
      "Full Stack Developer specializing in Java, Spring Boot, React, microservices, secure APIs, and scalable web applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-text font-sans antialiased relative">
        <ContourBackground />
        <SmoothScroll />
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
