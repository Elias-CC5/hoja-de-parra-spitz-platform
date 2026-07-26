// src/app/(public)/page.tsx
import { Hero } from "@/features/home/components/Hero";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { BuffetServices } from "@/features/home/components/HowItWorks";
import { Testimonials } from "@/features/home/components/Testimonials";
import { ContactSection } from "@/features/home/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BuffetServices />
      <Testimonials />
      <ContactSection />
    </>
  );
}