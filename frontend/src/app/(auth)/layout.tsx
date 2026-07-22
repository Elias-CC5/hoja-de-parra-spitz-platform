import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-semibold">
        Hoja de Parra <span className="text-accent">Spitz</span>
      </Link>
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
