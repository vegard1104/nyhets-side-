"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    `font-medium transition-colors duration-150 ${
      pathname === href
        ? "text-brand-600 font-semibold"
        : "text-neutral-600 hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4" style={{ height: "56px" }}>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-foreground tracking-tight">
            NYHETSAPPEN
          </Link>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link href="/" className={navLinkClass("/")}>
              Norge
            </Link>
            <Link
              href="/verden"
              className={`flex items-center gap-1 font-medium transition-colors duration-150 ${
                pathname === "/verden"
                  ? "text-verden-700 font-semibold"
                  : "text-verden-600 hover:text-verden-700"
              }`}
            >
              🌍 Ute i verden
            </Link>
            <Link href="/quiz" className={navLinkClass("/quiz")}>
              Quiz
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {/* Mobile: Verden link */}
          <Link
            href="/verden"
            className="flex items-center gap-1 text-verden-600 hover:text-verden-700 sm:hidden"
            aria-label="Ute i verden"
          >
            🌍
          </Link>
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className="text-neutral-600 hover:text-foreground transition-colors duration-150"
              >
                Bokmerker
              </Link>
              <Link
                href="/profile"
                className="hidden rounded-full bg-brand-50 px-3 py-1 text-brand-700 font-medium hover:bg-brand-100 transition-colors duration-150 sm:inline"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="text-neutral-500 hover:text-foreground transition-colors duration-150"
              >
                Logg ut
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-[8px] bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
