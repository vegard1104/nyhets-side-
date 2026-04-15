# Nyhetsappen — Visuell Identitet

## Merkenavn og Logo

**Navn:** NYHETSAPPEN
**Logotype:** Ordmerke i Inter Bold, versaler, med et subtilt avisikon (foldet hjørne) integrert i bokstaven "N".

### Logoversjoner
- **Primær:** Mørk tekst på lys bakgrunn (`--color-brand-900` på hvit)
- **Invertert:** Hvit tekst på mørk bakgrunn
- **Ikon:** Forenklet "N" med fold-motiv til favicon og app-ikon
- **Minimum størrelse:** 24px høyde

## Fargepalett

### Primærfarger (Brand)
| Token                | Hex       | Bruk                                  |
|----------------------|-----------|---------------------------------------|
| `--color-brand-50`   | `#eff6ff` | Bakgrunn for fremhevede elementer     |
| `--color-brand-100`  | `#dbeafe` | Hover-tilstand på lette bakgrunner    |
| `--color-brand-500`  | `#3b82f6` | Lenker, ikoner, interaktive elementer |
| `--color-brand-600`  | `#2563eb` | Primærknapper, aktive tilstander      |
| `--color-brand-700`  | `#1d4ed8` | Hover på primærknapper                |
| `--color-brand-900`  | `#1e3a5f` | Logo, overskrifter                    |

### Gamification-farger
| Token                 | Hex       | Bruk                            |
|-----------------------|-----------|----------------------------------|
| `--color-xp-400`     | `#a78bfa` | XP-tekst, sekundær              |
| `--color-xp-500`     | `#8b5cf6` | XP-progressbar, badges          |
| `--color-xp-600`     | `#7c3aed` | XP-hover, aktive gamification   |
| `--color-gold-400`   | `#fbbf24` | Streak-flamme, toppnivå-badge   |
| `--color-gold-500`   | `#f59e0b` | Achievement-ikoner               |
| `--color-success-500` | `#22c55e` | Riktig svar, fullførte mål      |
| `--color-error-500`  | `#ef4444` | Feil svar, advarsler            |

### Nøytrale farger
| Token                  | Hex       | Bruk                         |
|------------------------|-----------|------------------------------|
| `--color-neutral-50`  | `#f8fafc` | Side-bakgrunn                 |
| `--color-neutral-100` | `#f1f5f9` | Kort-bakgrunn, seksjoner     |
| `--color-neutral-200` | `#e2e8f0` | Skillelinjer, rammer         |
| `--color-neutral-400` | `#94a3b8` | Placeholder-tekst            |
| `--color-neutral-500` | `#64748b` | Sekundær tekst, metadata     |
| `--color-neutral-700` | `#334155` | Brødtekst                    |
| `--color-neutral-900` | `#0f172a` | Overskrifter, primær tekst   |

### Verden (Internasjonal seksjon)
| Token                  | Hex       | Bruk                         |
|------------------------|-----------|------------------------------|
| `--color-verden-600`  | `#059669` | Verden-lenker, ikon           |
| `--color-verden-700`  | `#047857` | Verden hover-tilstand         |
| `--color-verden-50`   | `#ecfdf5` | Verden seksjonsbakgrunn       |

## Typografi

### Font-familie
- **Primær (sans):** Inter — moderne, svært lesbart, utmerket for norsk tekst
- **Mono:** Geist Mono — for kode og teknisk innhold
- **Fallback:** system-ui, -apple-system, sans-serif

### Typografisk skala
| Rolle          | Størrelse | Vekt        | Linjehøyde | Bruk                      |
|----------------|-----------|-------------|------------|---------------------------|
| Display        | 2rem      | 800 (ExBold)| 1.2        | Landingsside, hero        |
| H1             | 1.5rem    | 700 (Bold)  | 1.3        | Sidetitler                |
| H2             | 1.25rem   | 600 (Semi)  | 1.4        | Seksjonsoverskrifter      |
| H3             | 1.125rem  | 600 (Semi)  | 1.4        | Kort-titler               |
| Body           | 0.9375rem | 400 (Normal)| 1.6        | Brødtekst, artikkelinnhold|
| Body small     | 0.875rem  | 400 (Normal)| 1.5        | Sammendrag, metadata      |
| Caption        | 0.75rem   | 500 (Medium)| 1.4        | Tidsstempler, labels      |
| Badge          | 0.6875rem | 600 (Semi)  | 1          | Kategori-chips, XP-badges |

## Ikonstil

### Retningslinjer
- **Stil:** Outline (strøk), 1.5px strektykkelse
- **Størrelse:** 20px standard, 16px kompakt, 24px prominent
- **Kilde:** Lucide React (åpen kildekode, konsistent med Inter)
- **Farger:** Arver tekstfarge, eller brand-500 for interaktive

### Nøkkelikoner
| Ikon          | Bruk                  | Kontekst         |
|---------------|-----------------------|------------------|
| `Newspaper`   | Artikler, feed        | Navigasjon       |
| `Globe`       | Verden-seksjonen      | Navigasjon       |
| `Bookmark`    | Lagre artikler        | Handling          |
| `Search`      | Søk                   | Input             |
| `Trophy`      | XP og nivåer          | Gamification     |
| `Flame`       | Streak                | Gamification     |
| `Zap`         | Quiz                  | Gamification     |
| `User`        | Profil                | Navigasjon       |
| `BarChart3`   | Statistikk            | Profil           |
| `CheckCircle` | Riktig svar           | Quiz             |
| `XCircle`     | Feil svar             | Quiz             |

## Tone of Voice

### Prinsipper
1. **Vennlig og uformell** — Du-form, hverdagsspråk, ingen byråkratisk tone
2. **Engasjerende** — Motiverer til lesing med positive tilbakemeldinger
3. **Norsk først** — Bruk norske ord der det er naturlig, men engelske lånord er OK (quiz, badge, streak)
4. **Kort og presist** — Korte setninger, aktiv stemme

### Eksempler
| Kontekst              | Tekst                                          |
|-----------------------|------------------------------------------------|
| Tom feed              | "Ingen nyheter funnet. Prøv et annet søkeord!" |
| XP opptjent           | "Bra jobba! +15 XP"                           |
| Ny nivå               | "Gratulerer! Du er nå Nivå 5 🎉"              |
| Quiz riktig           | "Spot on! Du kjenner nyhetene."                |
| Quiz feil             | "Nesten! Det riktige svaret var..."            |
| Streak                | "🔥 7 dager på rad! Fortsett slik!"           |
| Første innlogging     | "Velkommen til Nyhetsappen!"                   |
| Daglig spørsmål       | "Dagens spørsmål er klart!"                    |

## Stemning og visuelle prinsipper

1. **Ren og luftig** — Generøs whitespace, tydelig hierarki
2. **Kortbasert** — Innhold presenteres i avrundede kort med subtile skygger
3. **Progressiv avsløring** — Vis det viktigste først, detaljer ved interaksjon
4. **Mikroanimasjoner** — Subtile overganger (200ms ease) for tilstandsendringer
5. **Tilgjengelig** — WCAG AA kontrast, fokusindikatorer, tastaturnavigasjon
