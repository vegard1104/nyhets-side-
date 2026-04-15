"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-gray-900">
            NYHETSAPPEN
          </Link>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link
              href="/"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Norge
            </Link>
            <Link
              href="/verden"
              className="flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-900"
            >
              🌍 Ute i verden
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {/* Mobile: Verden link */}
          <Link
            href="/verden"
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 sm:hidden"
            aria-label="Ute i verden"
          >
            🌍
          </Link>
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className="text-gray-600 hover:text-gray-900"
              >
                Bokmerker
              </Link>
              <Link
                href="/profile"
                className="hidden text-gray-600 hover:text-gray-900 sm:inline"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                Logg ut
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
