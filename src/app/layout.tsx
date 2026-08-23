import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "11 Días de Sorpresas",
  description: "Una gymkana digital de cumpleaños, día a día",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Deja el pinch-zoom disponible (accesibilidad) pero evita el "double-tap
  // to zoom" accidental en los botones/tarjetas al tocar rápido.
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0b0620",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
