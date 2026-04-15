"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          NYHETSAPPEN
        </Link>
        <nav className="flex items-center gap-4 text-sm">
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
                className="text-gray-600 hover:text-gray-900"
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
