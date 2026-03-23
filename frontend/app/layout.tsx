import Navbar from "../components/Navbar"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          transition: "all 0.3s ease",
          background: "#0e0e0e",
          color: "#fff",
        }}
      >

        {/* NAVBAR REAL */}
        <Navbar />

        {/* CONTEÚDO */}
        <div style={{ paddingTop: "100px" }}>
          {children}
        </div>

      </body>
    </html>
  );
}