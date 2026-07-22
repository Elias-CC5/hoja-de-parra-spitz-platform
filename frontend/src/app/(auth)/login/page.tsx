import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Bienvenido de nuevo</h1>
      <LoginForm />
    </div>
  );
}
