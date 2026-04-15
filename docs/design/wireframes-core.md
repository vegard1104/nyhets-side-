# Wireframes — Kjernesider

## 1. Feed (Hjem)

### Desktop (≥1024px)
```
┌──────────────────────────────────────────────────────────────────┐
│ NYHETSAPPEN       Norge | 🌍 Verden          Bokmerker  Profil   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ 🔍 ────────────────────────────────────────────────────────┐│
│  │  Søk etter artikler...                                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Alle] [Politikk] [Sport] [Teknologi] [Kultur] [Økonomi] ...  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   [Bilde]    │  │   [Bilde]    │  │   [Bilde]    │          │
│  │              │  │              │  │              │          │
│  │ Kategori  🔖 │  │ Kategori  🔖 │  │ Kategori  🔖 │          │
│  │ Overskrift   │  │ Overskrift   │  │ Overskrift   │          │
│  │ Sammendrag.. │  │ Sammendrag.. │  │ Sammendrag.. │          │
│  │ NRK  12.apr  │  │ VG   12.apr  │  │ DB   11.apr  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   [Bilde]    │  │   [Bilde]    │  │   [Bilde]    │          │
│  │   ...        │  │   ...        │  │   ...        │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│              [Forrige]  Side 1 av 5  [Neste]                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobil (<640px)
```
┌─────────────────────────┐
│ NYHETSAPPEN    🌍  👤    │
├─────────────────────────┤
│                         │
│ ┌─ 🔍 ───────────────┐ │
│ │ Søk...              │ │
│ └─────────────────────┘ │
│                         │
│ [Alle][Politikk][Sport] │
│ → horisontal scroll     │
│                         │
│ ┌─────────────────────┐ │
│ │     [Bilde]         │ │
│ │ Kategori        🔖  │ │
│ │ Overskrift          │ │
│ │ Sammendrag...       │ │
│ │ Kilde      Dato     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │     [Bilde]         │ │
│ │ ...                 │ │
│ └─────────────────────┘ │
│                         │
│   [Forrige] 1/5 [Neste] │
└─────────────────────────┘
```

### Interaksjonsmønster
- Søk: 300ms debounce, filtrerer artikler
- Kategori-chips: Horisontal scroll på mobil, wrapping på desktop
- Artikkelkort: Hover gir skygge, klikk åpner artikkelvisning
- Bokmerke-knapp: Toggle med fyllt/tom ikon, toast ved lagring
- Infinite scroll (fremtidig): Kan erstatte paginering

---

## 2. Artikkelvisning

### Desktop
```
┌──────────────────────────────────────────────────────────────────┐
│ NYHETSAPPEN       Norge | 🌍 Verden          Bokmerker  Profil   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← Tilbake til forsiden                                          │
│                                                                  │
│  [Kategori-badge]                                                │
│                                                                  │
│  Artikkeloverskrift over                                         │
│  én eller to linjer                                              │
│                                                                  │
│  NRK  •  12. april 2026  •  5 min lesetid                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │              [Hovedbilde — full bredde]                   │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│  Bildetekst i kursiv                                             │
│                                                                  │
│  Artikkeltekst med god linjehøyde og lesbar kolonnebredde.       │
│  Maks bredde 680px for optimal leselengde. Teksten flyter        │
│  naturlig med avsnitt og mellomrom.                              │
│                                                                  │
│  Neste avsnitt fortsetter her med mer innhold og detaljer        │
│  om saken...                                                     │
│                                                                  │
│  ┌────────────────────────────────────────┐                      │
│  │ 🔖 Lagre artikkel    🔗 Del artikkel   │                      │
│  └────────────────────────────────────────┘                      │
│                                                                  │
│  ┌────────────────────────────────────────┐                      │
│  │ ✅ Artikkel lest — +10 XP              │                      │
│  │ ████████████████░░░░  750/1000 XP      │                      │
│  └────────────────────────────────────────┘                      │
│                                                                  │
│  Les original artikkel hos NRK →                                 │
│                                                                  │
│  ─── Relaterte artikler ──────────────────                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  [Relatert]  │  │  [Relatert]  │  │  [Relatert]  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Interaksjonsmønster
- Tilbake-knapp: Navigerer til forrige side (ikke bare forsiden)
- XP-belønning: Vises etter scroll til 75% av artikkelen
- Bokmerke: Samme toggle som i feed-kortene
- Ekstern lenke: Åpner i ny fane med `rel="noopener"`

---

## 3. Søk (integrert i feed)

Søkefunksjonen er integrert i feed-siden, ikke en egen side.

### Søk aktiv-tilstand
```
┌─ 🔍 ──────────────────────────────────────────────┐
│  klima                                     [✕]     │
└────────────────────────────────────────────────────┘

  Viser 8 resultater for "klima"

  ┌──────────────────────────────────────────────────┐
  │ [Bilde]  Overskrift med **klima** uthevet        │
  │          Sammendrag med **klima** markert...      │
  │          NRK  •  12. apr 2026                     │
  └──────────────────────────────────────────────────┘
```

### Interaksjonsmønster
- Søkeord utheves i resultater med `<mark>` eller `font-bold text-brand-600`
- Tøm-knapp (✕) vises når feltet har innhold
- Ingen resultater: Viser tom-tilstand med forslag
- Søk kombineres med kategorifilter

---

## 4. Kategorifilter

### Standard (ingen aktiv)
```
[Alle] [Politikk] [Sport] [Teknologi] [Kultur] [Økonomi] [Helse]
  ↑ aktiv (brand-600, hvit tekst)
```

### Med valgt kategori
```
[Alle] [Politikk] [Sport] [Teknologi] [Kultur] [Økonomi] [Helse]
                    ↑ aktiv
```

### Mobil: Horisontal scroll
```
← [Alle] [Politikk] [Sport] [Teknologi] [Kultur] →
  scroll-indikator med gradient-fade på kantene
```

### Interaksjonsmønster
- Klikk på aktiv kategori deaktiverer filteret (tilbake til "Alle")
- Endrer URL-parameter: `?category=sport`
- Animert overgang mellom filtrerte resultater
- Chip-scroll: `overflow-x-auto` med skjulte scrollbarer og fade-gradient
