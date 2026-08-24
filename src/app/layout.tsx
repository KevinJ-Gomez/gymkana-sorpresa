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
  // El pellizco con dos dedos es un gesto propio de la app (alejar/acercar el
  // corazón, ver `onMapViewChange` en NebulaScene): si el navegador también lo
  // interpreta como zoom nativo de página, la app queda re-escalada por CSS
  // sobre un canvas WebGL que no cambia de resolución, y el resultado se ve
  // pixelado y con las líneas de la constelación estiradas fuera de sitio.
  maximumScale: 1,
  userScalable: false,
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
      <body>{children}</body>
    </html>
  );
}
