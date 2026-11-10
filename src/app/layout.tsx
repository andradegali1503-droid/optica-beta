import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ÓpticaPro — Sistema Integral de Gestión Clínica y Óptica",
  description:
    "Plataforma profesional para gestión de pacientes, recetas optométricas, agenda clínica, inventario de monturas y lentes, y facturación.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.variable} font-sans h-full antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
