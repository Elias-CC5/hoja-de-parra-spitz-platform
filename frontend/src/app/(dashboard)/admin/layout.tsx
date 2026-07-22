import { RequireAuth } from "@/components/shared/RequireAuth";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { Role } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth allowedRoles={[Role.ADMIN, Role.EMPLEADO]}>
      <div className="flex gap-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </RequireAuth>
  );
}
