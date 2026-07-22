import { RequireAuth } from "@/components/shared/RequireAuth";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Navbar />
      <div className="min-h-screen bg-neutral-950 text-neutral-100 pt-28 pb-16 px-4 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* AQUÍ SE RENDERIZA EL SIDEBAR UNA SOLA VEZ PARA TODO LO QUE ESTÉ DENTRO DE /admin */}
            <AdminSidebar />

            <main className="flex-1 w-full min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
      <CartDrawer />
    </RequireAuth>
  );
}