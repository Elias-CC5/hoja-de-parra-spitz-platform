import { Hero } from "@/features/home/components/Hero";
import { CategoryGrid } from "@/features/home/components/CategoryGrid";
import { FeaturedProducts } from "@/features/home/components/FeaturedProducts";
import { HowItWorks } from "@/features/home/components/HowItWorks";
import { Testimonials } from "@/features/home/components/Testimonials";
import { ContactSection } from "@/features/home/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <ContactSection />
    </>
  );
}
