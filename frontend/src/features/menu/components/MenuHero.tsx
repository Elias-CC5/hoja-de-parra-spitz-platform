// src/features/home/components/Hero.tsx
"use client";

import { MagneticSpotlightMarquee } from "@/components/shared/scroll-stack/magnetic-spotlight-marquee";

interface MenuHeroProps {
  totalItems?: number;
  isLoading?: boolean;
}

export function MenuHero({ totalItems, isLoading }: MenuHeroProps) {
  return <MagneticSpotlightMarquee />;
}