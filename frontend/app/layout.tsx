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

        {/* NAVBAR */}
        <header style={{
          position: "fixed",
          top: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          zIndex: 1000
        }}>
          <h1 style={{ letterSpacing: "2px", fontSize: "20px" }}>
            1M2F
          </h1>

          <nav style={{ display: "flex", gap: "30px" }}>
            <a href="/">Home</a>
            <a href="/artworks">Artworks</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </header>

        <div style={{ paddingTop: "80px" }}>
          {children}
        </div>

      </body>
    </html>
  );
}