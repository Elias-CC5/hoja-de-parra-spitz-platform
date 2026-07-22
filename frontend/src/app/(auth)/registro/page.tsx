import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Crea tu cuenta</h1>
      <RegisterForm />
    </div>
  );
}
