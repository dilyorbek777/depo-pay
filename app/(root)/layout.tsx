import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import Newsletter from '@/components/site/newsletter';
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/convex-provider";
import { UserSync } from "@/components/providers/user-sync";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ConvexClientProvider>
        <UserSync />
        <Navbar />
        <main>{children}</main>
        <Newsletter />
        <Footer />
      </ConvexClientProvider>
  );
}
