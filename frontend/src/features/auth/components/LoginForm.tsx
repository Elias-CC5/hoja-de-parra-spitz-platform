"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginFormValues } from "../services/auth.schemas";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch {
      setServerError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-card">
      <div className="login-card__header">
        <h1 className="login-card__title">Bienvenido de nuevo</h1>
        <p className="login-card__subtitle">Ingresa tus datos para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="login-field">
          <Label htmlFor="email" className="login-label">
            Correo electrónico
          </Label>
          <div className="login-input-wrapper">
            <Mail className="login-input-icon" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="login-input"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="login-error">
              <AlertCircle size={14} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="login-field">
          <Label htmlFor="password" className="login-label">
            Contraseña
          </Label>
          <div className="login-input-wrapper">
            <Lock className="login-input-icon" size={18} />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="login-input"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="login-error">
              <AlertCircle size={14} />
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <div className="login-server-error">
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}

        <Button type="submit" className="login-submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
        </Button>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="login-link">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}