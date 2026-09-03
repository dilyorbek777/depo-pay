
import ConvexClientProvider from "@/components/providers/convex-provider";
import { UserSync } from "@/components/providers/user-sync";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
      <UserSync />
      <div className="min-h-screen">{children}</div>
    </ConvexClientProvider>
  );
}
