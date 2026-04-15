# Wireframes — Quiz og Dagens Spørsmål

## 1. Dagens Spørsmål (Daglig)

### Kort i feed (collapsed)
```
┌──────────────────────────────────────────────────────┐
│ ⚡ Dagens spørsmål                          NYTT!     │
│                                                      │
│ Test kunnskapen din om dagens nyheter                 │
│                                                      │
│                   [Svar nå →]                        │
│                                                      │
│ 🔥 12 dager streak  •  Tilgjengelig til 23:59        │
└──────────────────────────────────────────────────────┘
```

- **Plassering:** Øverst i feed, før artiklene
- **Bakgrunn:** Gradient `brand-50` → `xp-50` (subtil)
- **Kant:** `2px solid brand-200`, dashed
- **Animasjon:** Subtil puls på "NYTT!" badge

### Spørsmål-visning (expanded)
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ⚡ Dagens spørsmål — 15. april 2026                 │
│                                                      │
│  Hvilket land vedtok ny klimaavtale                   │
│  denne uken?                                          │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  A) Sverige                                   │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  B) Norge                                     │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  C) Danmark                                   │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  D) Finland                                   │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Hint: Relatert artikkel fra NRK i går               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Svar-alternativer — Tilstander

**Standard (ubesvart):**
```
┌──────────────────────────────────────────────┐
│  A) Sverige                                   │
└──────────────────────────────────────────────┘
```
- Bakgrunn: `white`, kant: `neutral-200`
- Hover: `brand-50`, kant: `brand-300`

**Valgt (riktig svar):**
```
┌──────────────────────────────────────────────┐
│  ✅ B) Norge                          +15 XP │
└──────────────────────────────────────────────┘
```
- Bakgrunn: `success-50`, kant: `success-500`
- Ikon: Grønn hake, XP-badge animerer inn

**Valgt (feil svar):**
```
┌──────────────────────────────────────────────┐
│  ❌ A) Sverige                               │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  ✅ B) Norge  ← Riktig svar                  │
└──────────────────────────────────────────────┘
```
- Feil: `error-50` bakgrunn, `error-500` kant
- Riktig: Fremheves med grønn

### Resultat etter svar
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  🎉 Riktig!                                          │
│                                                      │
│  Norge vedtok en ny klimaavtale tirsdag som           │
│  sikter mot 55% kutt innen 2030.                      │
│                                                      │
│  +15 XP   🔥 13 dager streak!                        │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ 📰 Les hele artikkelen: "Norge vedtar ny      │    │
│  │    klimaavtale" — NRK →                       │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Neste spørsmål om: 14t 32min                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 2. Ukentlig Quiz

### Quiz-inngang (fra profil eller navigasjon)
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  📝 Ukens Nyhetsquiz                                 │
│                                                      │
│  Uke 16, 2026                                        │
│  10 spørsmål om ukens viktigste nyheter              │
│                                                      │
│  ⏱ Ca. 5 minutter                                    │
│  🏆 Opptil 100 XP                                    │
│                                                      │
│  Forrige resultat: 8/10 (80 XP)                      │
│                                                      │
│              [Start quiz →]                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Quiz — Spørsmål-flyt
```
┌──────────────────────────────────────────────────────┐
│  Spørsmål 3 av 10                    ████░░░░  30%   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Hva het operasjonen der norsk politi              │
│  slo til mot svindelnettverket?                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  A) Operasjon Cyber                           │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  B) Operasjon Nettsvindel                     │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  C) Operasjon Trojan                          │    │
│  └──────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────┐    │
│  │  D) Operasjon Shield                          │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│              [Hopp over →]                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Progressbar (quiz)
- **Plassering:** Toppen av quiz-visningen
- **Stil:** Tynn bar (`4px`) med prosentandel
- **Farge:** `brand-500` → `success-500` (grønn ved >80%)
- **Tekst:** "Spørsmål X av Y" til venstre, prosent til høyre

### Mellom spørsmål (feedback)
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ✅ Riktig!                               +10 XP     │
│                                                      │
│  Operasjon Trojan var en felles-europeisk aksjon     │
│  ledet av Kripos i mars 2026.                         │
│                                                      │
│  📰 Relatert: "Kripos knuser svindelring" — VG       │
│                                                      │
│              [Neste spørsmål →]                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Quiz — Resultatside
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                    🏆                                │
│                                                      │
│            8 av 10 riktige!                           │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │        ⭐⭐⭐⭐⭐⭐⭐⭐☆☆                         │    │
│  │                                               │    │
│  │  Total XP opptjent:  +80 XP                   │    │
│  │  Streak-bonus:        +5 XP                   │    │
│  │  ──────────────────────────                   │    │
│  │  Totalt denne quizen: +85 XP                  │    │
│  │                                               │    │
│  │  ████████████████████░░  830 / 1000 XP        │    │
│  │  Bare 170 XP til Nivå 6!                      │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ─── Gjennomgang ────────────────────────────────    │
│                                                      │
│  ✅ 1. Klimaavtalen — Norge                          │
│  ✅ 2. OL-byen 2034 — Salt Lake City                 │
│  ❌ 3. EU-valget — 67% (du svarte 72%)              │
│  ✅ 4. Operasjon Trojan — Kripos                     │
│  ...                                                  │
│                                                      │
│  [Del resultat]    [Tilbake til forsiden]             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Mobil quiz-flyt
```
┌─────────────────────────┐
│ ← Quiz     3/10    30%  │
│ ████░░░░░░░░░░░░░░░░░░ │
├─────────────────────────┤
│                         │
│ Hva het operasjonen     │
│ der norsk politi slo    │
│ til mot svindle-        │
│ nettverket?             │
│                         │
│ ┌─────────────────────┐ │
│ │ A) Operasjon Cyber  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ B) Op. Nettsvindel  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ C) Op. Trojan       │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ D) Op. Shield       │ │
│ └─────────────────────┘ │
│                         │
│      [Hopp over →]      │
└─────────────────────────┘
```

## XP-belønningsstruktur

| Handling                      | XP   | Betingelse                |
|-------------------------------|------|---------------------------|
| Les artikkel (>75% scroll)    | 10   | Maks 10 per dag           |
| Dagens spørsmål (riktig)      | 15   | Én per dag                |
| Dagens spørsmål (feil)        | 5    | Deltakelse belønnes       |
| Quiz-spørsmål (riktig)        | 10   | Per spørsmål              |
| Quiz-spørsmål (feil)          | 0    | Ingen XP                  |
| Streak-bonus (7+ dager)       | 5    | Per quiz/daglig spørsmål  |
| Streak-bonus (30+ dager)      | 15   | Per quiz/daglig spørsmål  |
| Første artikkel i dag         | 5    | Bonus                     |
| Bokmerke artikkel             | 2    | Maks 5 per dag            |

## Nivåsystem

| Nivå | Tittel          | XP krav  | Badge |
|------|-----------------|----------|-------|
| 1    | Nybegynner      | 0        | 📰    |
| 2    | Nysgjerrig      | 100      | 📰    |
| 3    | Leser           | 300      | 📰    |
| 4    | Nyhetsfan       | 600      | 📖    |
| 5    | Nyhetsjeger     | 1000     | 📖    |
| 6    | Nyhetsekspert   | 1500     | 📖    |
| 7    | Ekspert         | 2500     | 🏆    |
| 8    | Mester          | 4000     | 🏆    |
| 9    | Guru            | 6000     | 🏆    |
| 10   | Legende         | 10000    | ⭐    |
