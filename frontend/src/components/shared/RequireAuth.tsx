"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types";

/**
 * Envuelve páginas que requieren sesión iniciada (y opcionalmente un rol
 * específico). Como la auth vive en localStorage (client-side), esperamos
 * a la hidratación de Zustand antes de decidir si redirigir.
 */
export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    fetchProfile().finally(() => setIsChecking(false));
  }, [fetchProfile]);

  useEffect(() => {
    if (isChecking) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/");
    }
  }, [isChecking, isAuthenticated, user, allowedRoles, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
