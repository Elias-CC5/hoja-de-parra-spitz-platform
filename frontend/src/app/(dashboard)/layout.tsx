import { RequireAuth } from "@/components/shared/RequireAuth";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/CartDrawer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      <CartDrawer />
    </RequireAuth>
  );
}
