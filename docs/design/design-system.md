# Nyhetsappen — Designsystem

## Komponentbibliotek

### 1. Knapper (Buttons)

#### Varianter
| Variant     | Bakgrunn            | Tekst                | Kant           | Bruk                       |
|-------------|---------------------|----------------------|----------------|----------------------------|
| Primary     | `brand-600`         | `white`              | Ingen          | Hovedhandlinger            |
| Secondary   | `white`             | `brand-600`          | `brand-200`    | Sekundære handlinger       |
| Ghost       | `transparent`       | `neutral-700`        | Ingen          | Tertiære, navigasjon       |
| Danger      | `error-500`         | `white`              | Ingen          | Sletting, farlige valg     |
| XP          | `xp-500`            | `white`              | Ingen          | Gamification-handlinger    |

#### Størrelse
| Størrelse | Padding        | Font     | Radius    |
|-----------|----------------|----------|-----------|
| sm        | `px-3 py-1.5`  | `text-sm`| `8px`     |
| md        | `px-4 py-2`    | `text-sm`| `8px`     |
| lg        | `px-6 py-3`    | `text-base`| `10px`  |

#### Tilstander
- **Hover:** 10% mørkere bakgrunn, `transition-colors 150ms`
- **Aktiv:** 15% mørkere, scale(0.98)
- **Fokus:** `ring-2 ring-brand-500 ring-offset-2`
- **Deaktivert:** `opacity-50 cursor-not-allowed`

### 2. Kort (Cards)

#### Artikkelkort
```
┌──────────────────────────────┐
│         [Bilde 16:9]         │
│                              │
├──────────────────────────────┤
│ [Kategori-badge]  [Bokmerke] │
│                              │
│ Artikkeloverskrift som kan   │
│ gå over to linjer            │
│                              │
│ Kort sammendrag av innholdet │
│ med maks to linjer...        │
│                              │
│ Kilde            12. apr 2026│
└──────────────────────────────┘
```
- **Radius:** `12px`
- **Kant:** `1px solid neutral-200`
- **Skygge:** Ingen standard, `shadow-md` ved hover
- **Bildehøyde:** `192px` (h-48)
- **Padding:** `16px` innhold
- **Overgang:** `shadow 200ms ease`

#### Statistikk-kort
```
┌────────────────┐
│     [Ikon]     │
│      42        │
│  Artikler lest │
└────────────────┘
```
- **Bakgrunn:** Semantisk farge med lav metning (f.eks. `brand-50`)
- **Radius:** `12px`
- **Padding:** `16px`
- **Tall:** `text-2xl font-bold`
- **Etikett:** `text-sm` i matchende farge

#### XP-kort (Gamification)
```
┌──────────────────────────────┐
│ 🏆 Nivå 5 — Nyhetsjeger     │
│                              │
│ ████████████░░░░  750/1000 XP│
│                              │
│ 🔥 12 dager streak           │
└──────────────────────────────┘
```
- **Bakgrunn:** Gradient `xp-500` → `brand-600`
- **Tekst:** Hvit
- **Radius:** `16px`
- **Padding:** `24px`

### 3. Navigasjon

#### Toppmeny (Header)
```
┌──────────────────────────────────────────────┐
│ NYHETSAPPEN    Norge | 🌍 Verden   [Profil ▾]│
└──────────────────────────────────────────────┘
```
- **Sticky:** `top-0 z-50`
- **Bakgrunn:** `white` med `border-b neutral-200`
- **Høyde:** `56px`
- **Max bredde:** `max-w-5xl` sentrert
- **Aktiv lenke:** `brand-600` med `font-semibold`

#### Mobilnavigasjon
```
┌──────────────────────────────┐
│ NYHETSAPPEN        [≡] [👤] │
└──────────────────────────────┘
```
- Hamburger-meny for navigasjon under `sm` breakpoint
- Profilikon med avatar eller initialer

### 4. Badges

#### Kategori-badge
- **Bakgrunn:** `brand-50`
- **Tekst:** `brand-700`, `text-xs font-medium`
- **Padding:** `px-2.5 py-0.5`
- **Radius:** `9999px` (full rounded)

#### Nivå-badge
| Nivå    | Farge      | Ikon  |
|---------|-----------|-------|
| 1-3     | `brand`   | 📰    |
| 4-6     | `xp`      | 📖    |
| 7-9     | `gold`    | 🏆    |
| 10+     | Gradient  | ⭐    |

- **Form:** Pill med ikon + tekst
- **Tekst:** `text-xs font-semibold`
- **Padding:** `px-3 py-1`

#### XP-badge (inline)
```
+15 XP
```
- **Bakgrunn:** `xp-500`
- **Tekst:** Hvit, `text-xs font-bold`
- **Animasjon:** Fade-in + float-up ved opptjening

### 5. XP-Progressbar

```
Level 5                    750 / 1000 XP
████████████████░░░░░░░░░░░░░░░░░░░░░░
```

- **Høyde:** `8px` (standard), `12px` (profil)
- **Bakgrunn:** `neutral-200`
- **Fyll:** Gradient `xp-500` → `brand-500`
- **Radius:** `9999px`
- **Animasjon:** Bredde-overgang `500ms ease-out`
- **Etikett:** Vises over baren med nivå (venstre) og XP (høyre)

### 6. Modaler

```
┌──────────────────────────────────────┐
│ Overskrift                      [✕]  │
├──────────────────────────────────────┤
│                                      │
│           Modalinnhold               │
│                                      │
├──────────────────────────────────────┤
│              [Avbryt]  [Bekreft]     │
└──────────────────────────────────────┘
```

- **Overlay:** `bg-black/50 backdrop-blur-sm`
- **Radius:** `16px`
- **Max bredde:** `max-w-md`
- **Padding:** `24px`
- **Animasjon:** Fade + scale-in `200ms ease`
- **Tilgjengelighet:** Focus trap, Escape lukker, `role="dialog"`

### 7. Søkefelt

```
┌─ 🔍 ──────────────────────────────┐
│  Søk etter artikler...             │
└────────────────────────────────────┘
```

- **Radius:** `12px`
- **Kant:** `neutral-300`, `brand-500` ved fokus
- **Fokus:** `ring-1 ring-brand-500`
- **Ikon:** `Search` fra Lucide, `neutral-400`
- **Padding:** `px-4 py-2.5` med plass til ikon

### 8. Toast / Feedback

```
┌───────────────────────────────┐
│ ✅  Artikkel lagret!           │
└───────────────────────────────┘
```

- **Posisjon:** Bunn-senter, `bottom-6`
- **Radius:** `12px`
- **Skygge:** `shadow-lg`
- **Animasjon:** Slide-up + fade, auto-dismiss etter 3s
- **Varianter:** Suksess (grønn), Feil (rød), Info (blå), XP (lilla)

## Spacing-system

Basert på 4px grid:
| Token  | Verdi | Bruk                    |
|--------|-------|-------------------------|
| `xs`   | 4px   | Intern komponent-gap    |
| `sm`   | 8px   | Tett spacing            |
| `md`   | 16px  | Standard padding/margin |
| `lg`   | 24px  | Seksjon-spacing         |
| `xl`   | 32px  | Side-padding            |
| `2xl`  | 48px  | Mellom seksjoner        |

## Radius-skala

| Token    | Verdi  | Bruk                      |
|----------|--------|---------------------------|
| `sm`     | 6px    | Inputs, små elementer     |
| `md`     | 8px    | Knapper                   |
| `lg`     | 12px   | Kort, modaler             |
| `xl`     | 16px   | Hero-kort, XP-kort        |
| `full`   | 9999px | Badges, avatarer, pills   |

## Skygge-skala

| Token   | Verdi                                    | Bruk              |
|---------|------------------------------------------|--------------------|
| `sm`    | `0 1px 2px rgba(0,0,0,0.05)`           | Subtile elementer  |
| `md`    | `0 4px 6px -1px rgba(0,0,0,0.1)`       | Kort hover         |
| `lg`    | `0 10px 15px -3px rgba(0,0,0,0.1)`     | Modaler, dropdowns |

## Animasjoner

| Navn            | Varighet | Easing       | Bruk                        |
|-----------------|----------|--------------|------------------------------|
| `fade-in`       | 200ms    | ease         | Elementer som vises          |
| `slide-up`      | 300ms    | ease-out     | Toast, XP-popup              |
| `scale-in`      | 200ms    | ease         | Modaler                      |
| `progress-fill` | 500ms    | ease-out     | XP-progressbar               |
| `bounce-subtle` | 400ms    | ease         | Achievement-ikon             |
| `shimmer`       | 1.5s     | ease-in-out  | Loading placeholder          |
