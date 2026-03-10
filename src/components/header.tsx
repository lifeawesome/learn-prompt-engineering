import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/pluralsight-logo.png"
            alt="Pluralsight"
            width={32}
            height={32}
            className="h-8 w-8 flex-shrink-0"
          />
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Micro-Lesson Prototype (By Dan Davidson)
          </h1>
        </Link>
      </div>
    </header>
  );
}
