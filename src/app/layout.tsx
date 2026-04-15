import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nyhetsappen",
  description: "Din daglige nyhetsportal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 font-sans">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
