"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 pt-0">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-lg bg-[#1a1a2e] shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-white hover:opacity-90"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#e63946]">
                <span className="text-sm font-black">N</span>
              </div>
              <span className="text-lg tracking-tight">NYHETSAPPEN</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-6 text-sm sm:flex">
              <Link
                href="/"
                className="font-medium text-gray-200 transition hover:text-white"
              >
                Norge
              </Link>
              <Link
                href="/verden"
                className="flex items-center gap-1 font-medium text-gray-200 transition hover:text-white"
              >
                <span className="text-base">🌍</span>
                <span>Verden</span>
              </Link>
              {user && (
                <Link
                  href="/quiz"
                  className="flex items-center gap-1 font-medium text-gray-200 transition hover:text-white"
                >
                  <span className="text-base">🧠</span>
                  <span>Quiz</span>
                </Link>
              )}
            </nav>

            {/* Desktop Auth */}
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              {user ? (
                <>
                  <Link
                    href="/bookmarks"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Bokmerker
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-300 transition hover:text-white"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-300 transition hover:text-white"
                  >
                    Logg ut
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-[#e63946] px-4 py-2 font-medium text-white transition hover:bg-red-700"
                >
                  Logg inn
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden text-gray-200 hover:text-white transition"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-700 px-4 py-4 sm:hidden">
              <nav className="space-y-3">
                <Link
                  href="/"
                  className="block font-medium text-gray-200 transition hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Norge
                </Link>
                <Link
                  href="/verden"
                  className="flex items-center gap-2 font-medium text-gray-200 transition hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-base">🌍</span>
                  <span>Verden</span>
                </Link>
                {user && (
                  <Link
                    href="/quiz"
                    className="flex items-center gap-2 font-medium text-gray-200 transition hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-base">🧠</span>
                    <span>Quiz</span>
                  </Link>
                )}
                {user ? (
                  <>
                    <Link
                      href="/bookmarks"
                      className="block text-gray-300 transition hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Bokmerker
                    </Link>
                    <Link
                      href="/profile"
                      className="block text-gray-300 transition hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-300 transition hover:text-white"
                    >
                      Logg ut
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block rounded-md bg-[#e63946] px-4 py-2 text-center font-medium text-white transition hover:bg-red-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logg inn
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
