import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/site/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Prime Pay | DEPOPAY',
  description: 'DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make transfers.',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    type: 'website',
    url: 'https://depo-pay.vercel.app',
    siteName: 'Prime Pay | DEPOPAY',
    
    images: ['/depo-pay.png', ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
