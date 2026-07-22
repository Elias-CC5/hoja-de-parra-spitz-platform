import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind evitando conflictos (ej. "p-2 p-4" -> "p-4").
 * Usado por todos los componentes de shadcn/ui y componentes propios.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
