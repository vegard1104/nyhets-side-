"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "signup" | "magic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Laster...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { signIn, signUp, signInWithMagicLink, user } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (user) {
    router.replace(redirectTo);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "magic") {
        await signInWithMagicLink(email);
        setMagicLinkSent(true);
      } else if (mode === "signup") {
        await signUp(email, password);
        router.replace(redirectTo);
      } else {
        await signIn(email, password);
        router.replace(redirectTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Sjekk e-posten din
        </h1>
        <p className="text-gray-600">
          Vi har sendt en innloggingslenke til <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        {mode === "signup" ? "Opprett konto" : "Logg inn"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            E-post
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {mode !== "magic" && (
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Passord
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "..."
            : mode === "magic"
              ? "Send innloggingslenke"
              : mode === "signup"
                ? "Opprett konto"
                : "Logg inn"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
        {mode === "login" && (
          <>
            <button
              onClick={() => setMode("magic")}
              className="block w-full hover:text-gray-700"
            >
              Logg inn med e-postlenke i stedet
            </button>
            <button
              onClick={() => setMode("signup")}
              className="block w-full hover:text-gray-700"
            >
              Har du ikke konto? Opprett en
            </button>
          </>
        )}
        {mode === "signup" && (
          <button
            onClick={() => setMode("login")}
            className="hover:text-gray-700"
          >
            Har du allerede konto? Logg inn
          </button>
        )}
        {mode === "magic" && (
          <button
            onClick={() => setMode("login")}
            className="hover:text-gray-700"
          >
            Logg inn med passord i stedet
          </button>
        )}
      </div>
    </div>
  );
}
