import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: "QR Code Pro | Gerador Premium & Analytics",
  description: "Crie QR Codes profissionais e rastreáveis com design incrível em segundos.",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-black text-white antialiased selection:bg-purple-500/30 selection:text-purple-200`}>
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="bg-blur-shape w-[800px] h-[800px] -top-[200px] -right-[200px] bg-purple-900/30 rounded-full blur-[100px]" />
          <div className="bg-blur-shape w-[600px] h-[600px] -bottom-[100px] -left-[100px] bg-indigo-900/20 rounded-full blur-[100px]" style={{ animationDelay: '-5s' }} />
          <div className="bg-blur-shape w-[400px] h-[400px] top-[40%] left-[50%] -translate-x-1/2 bg-fuchsia-900/20 rounded-full blur-[100px]" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Content */}
        {children}
      </body>
    </html>
  );
}
