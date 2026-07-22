"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { profileService } from "../services/profile.service";

export function EditProfileForm() {
  const { user, fetchProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await profileService.updateProfile({ fullName, phone });
      await fetchProfile();
      setMessage("Perfil actualizado correctamente");
    } catch {
      setMessage("No pudimos actualizar tu perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage(null);
    try {
      await profileService.changePassword({ currentPassword, newPassword });
      setPasswordMessage("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPasswordMessage("La contraseña actual es incorrecta");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <h3 className="font-display text-lg font-medium">Datos personales</h3>
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="animate-spin" />}
          Guardar cambios
        </Button>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 border-t border-border pt-8">
        <h3 className="font-display text-lg font-medium">Cambiar contraseña</h3>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        {passwordMessage && <p className="text-sm text-muted-foreground">{passwordMessage}</p>}
        <Button type="submit" variant="outline" disabled={isChangingPassword}>
          {isChangingPassword && <Loader2 className="animate-spin" />}
          Actualizar contraseña
        </Button>
      </form>
    </div>
  );
}
