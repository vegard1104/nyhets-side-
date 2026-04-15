"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Mode = "login" | "signup" | "magic";

function translateAuthError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials"))
    return "Feil e-postadresse eller passord.";
  if (msg.includes("email not confirmed"))
    return "E-postadressen er ikke bekreftet. Sjekk innboksen din for en bekreftelseslenke.";
  if (msg.includes("user already registered") || msg.includes("already been registered"))
    return "Denne e-postadressen er allerede registrert. Prøv å logge inn i stedet.";
  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("email rate limit"))
    return "For mange forsøk. Vent litt og prøv igjen, eller bruk «Logg inn med e-postlenke».";
  if (msg.includes("password should be at least"))
    return "Passordet må være minst 6 tegn.";
  if (msg.includes("unable to validate email address"))
    return "Ugyldig e-postadresse.";
  if (msg.includes("signup is disabled"))
    return "Registrering er for øyeblikket deaktivert.";
  return message;
}

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
  const [signupConfirmationSent, setSignupConfirmationSent] = useState(false);

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
        const { needsEmailConfirmation } = await signUp(email, password);
        if (needsEmailConfirmation) {
          setSignupConfirmationSent(true);
        } else {
          router.replace(redirectTo);
        }
      } else {
        await signIn(email, password);
        router.replace(redirectTo);
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Noe gikk galt";
      setError(translateAuthError(raw));
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
        <button
          onClick={() => { setMagicLinkSent(false); setMode("login"); }}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Tilbake til innlogging
        </button>
      </div>
    );
  }

  if (signupConfirmationSent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Bekreft e-postadressen din
        </h1>
        <p className="text-gray-600">
          Vi har sendt en bekreftelseslenke til <strong>{email}</strong>.
          Klikk på lenken i e-posten for å aktivere kontoen din.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Har du ikke fått e-posten? Sjekk søppelpost, eller prøv{" "}
          <button
            onClick={() => { setSignupConfirmationSent(false); setMode("magic"); setPassword(""); }}
            className="text-blue-600 hover:underline"
          >
            innlogging med e-postlenke
          </button>
          .
        </p>
        <button
          onClick={() => { setSignupConfirmationSent(false); setMode("login"); }}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Tilbake til innlogging
        </button>
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
              onClick={() => { setMode("magic"); setError(null); }}
              className="block w-full hover:text-gray-700"
            >
              Logg inn med e-postlenke i stedet
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className="block w-full hover:text-gray-700"
            >
              Har du ikke konto? Opprett en
            </button>
          </>
        )}
        {mode === "signup" && (
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className="hover:text-gray-700"
          >
            Har du allerede konto? Logg inn
          </button>
        )}
        {mode === "magic" && (
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className="hover:text-gray-700"
          >
            Logg inn med passord i stedet
          </button>
        )}
      </div>
    </div>
  );
}
