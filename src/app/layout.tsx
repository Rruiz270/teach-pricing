import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TEACH Platform - Calculadora de Preços | Better Tech",
  description: "Calculadora interativa de preços para cursos de IA para educadores da plataforma TEACH",
  keywords: "TEACH, IA, educação, professores, Brasil, Better Tech, calculadora, preços",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}