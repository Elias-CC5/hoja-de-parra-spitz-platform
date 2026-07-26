import { Navbar } from "@/components/layout/Navbar";
import { AnimatedFooter } from "@/components/shared/scroll-stack/animated-footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { ChatWidget } from "@/features/chatbot/components/ChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>

      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <AnimatedFooter
          headingLines={["Hoja de Parra"]}
          leftImage="https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?q=80&w=800&auto=format&fit=crop"
          rightImage="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop"
          background="#0c0a09"
          textColor="#f5f5f4"
          hoverColor="#f59e0b"
          columns={100}
          cellSize={14}
          fontSize={13}
        />
      </div>

      <CartDrawer />
      <ChatWidget />
    </>
  );
}