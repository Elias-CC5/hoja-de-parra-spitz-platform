import { RequireAuth } from "@/components/shared/RequireAuth";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/CartDrawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-16 px-4 md:px-8">
        {children}
      </main>
      <CartDrawer />
    </RequireAuth>
  );
}