import { StatsCards } from "@/features/admin/components/StatsCards";
import { TopProductsCard } from "@/features/admin/components/TopProductsCard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Panel administrativo</p>
        <h1 className="font-display text-2xl font-medium">Dashboard</h1>
      </div>
      <StatsCards />
      <TopProductsCard />
    </div>
  );
}
