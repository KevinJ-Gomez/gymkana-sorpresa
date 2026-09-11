import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "11 Días de Sorpresas ✨",
  description: "Una sorpresa especial de cumpleaños",
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
  themeColor: "#15061c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body>{children}</body>
    </html>
  );
}
