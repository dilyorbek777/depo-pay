import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/site/navbar";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  metadataBase: new URL('https://depo-pay.vercel.app'),
  title: 'Prime Pay | DEPOPAY',
  description:
    'DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make transfers.',
  authors: [
    { name: 'Dilyorbek Asfandiyorov', url: 'https://depo-pay.vercel.app' },
  ],

  icons: { icon: 'https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/favicon.png' },
  keywords:
    'dilyorbekdev, depo,  programming, payment, depo pay, depopay, depo-pay, primepay, prime-pay, prime, pay, dilyorbek asfandiyorov, depohub, DEPOPAY, e-wallet, is, a, modern, payment, tool, ',
  openGraph: {

    countryName: 'Uzbekistan',
    siteName: 'Prime Pay | DEPOPAY',
    emails: 'dilyorbekdev@gmail.com',
    title: 'Prime Pay | DEPOPA',
    description:
      'DEPOPAY e-wallet is a modern payment tool that allows you to conveniently and safely use Payme to pay for goods and services and make transfers.',
    type: 'website',
    url: 'https://depo-pay.vercel.app',
    locale: 'en_EN',
    images: 'https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/depo-pay.png',
  },
  creator: 'Dilyorbek Asfandiyorov',
  publisher: 'DEPO ',
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
