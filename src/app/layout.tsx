import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: "QR Code Generator Pro | Gerador Profissional",
  description: "Gerador de QR Code profissional e gratuito. Converta links em QR Codes personalizados com logo, cores e estilos customizáveis. Rastreie escaneamentos em tempo real.",
  keywords: ["QR Code", "gerador", "tracking", "analytics", "personalizado"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        {/* Background shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="bg-shape absolute -top-48 -right-48 w-[600px] h-[600px]"
            style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)' }}
          />
          <div
            className="bg-shape absolute -bottom-36 -left-36 w-[500px] h-[500px]"
            style={{
              background: 'radial-gradient(circle, rgba(107, 33, 168, 0.4) 0%, transparent 70%)',
              animationDelay: '-7s'
            }}
          />
          <div
            className="bg-shape absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
              animationDelay: '-14s'
            }}
          />
        </div>

        {/* Main content */}
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
