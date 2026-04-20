import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stream Zone - Tu plataforma de películas",
  description: "Descubre y busca tus películas favoritas en Stream Zone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/app.png')",
        }}
      >
        <div className="min-h-full bg-black/70 backdrop-blur-sm">
          <AuthProvider>
            <Navbar />
            <main className="flex-1 pt-20">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}