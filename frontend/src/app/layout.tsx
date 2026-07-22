import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Hoja de Parra Spitz | Catering, Buffet y Eventos Corporativos",
    template: "%s | Hoja de Parra Spitz",
  },
  description:
    "Catering, buffet, coffee break, box lunch y servicio gastronómico para eventos empresariales y sociales. Cotiza y reserva en línea.",
  openGraph: {
    title: "Hoja de Parra Spitz",
    description:
      "Catering premium para eventos empresariales y sociales. Cotiza y reserva en línea.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
