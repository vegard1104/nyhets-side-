# Quick Start Guide - XP/Level & Quiz System

## 30-Second Setup

### 1. Apply Database Migration
```bash
# Run the new migration
supabase migration up
```

### 2. Seed Sample Quizzes
```bash
# Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npx ts-node scripts/seed-quizzes.ts
```

### 3. Start App
```bash
npm run dev
# Visit http://localhost:3000
```

## Test It Out

1. **Login** - Create account or login
2. **Go to Profile** - Visit `/profile`
   - See new activity heatmap
   - Edit your display name
   - View stats and category breakdown

3. **Go to Quiz** - Visit `/quiz`
   - Answer today's daily question (+20 XP)
   - Start a weekly quiz (+50 XP per correct answer)

4. **Check Header** - See new 🧠 Quiz link in navigation

## What You Get

### Profile Page
- Editable display name
- Level badge with XP progress bar
- Stats grid (articles, bookmarks, streak, level)
- Activity heatmap showing 12 weeks of reading
- Category distribution chart
- Reading history with timestamps

### Quiz System
- Daily questions (one per day)
- Weekly quizzes (4-5 questions each)
- Immediate feedback with explanations
- XP rewards tracked in profile
- Completion tracking (no repeats)

### XP Levels
```
1️⃣  Nybegynner (0 XP)
2️⃣  Leser (500 XP)
3️⃣  Nyhetssniffer (1500 XP)
4️⃣  Analytiker (3500 XP)
5️⃣  Redaktør (7000 XP)
6️⃣  Innsiktsfull (13000 XP)
7️⃣  Kunnskapsmeister (22000 XP)
```

## API Endpoints

All endpoints require `Authorization: Bearer {token}` header.

```
GET  /api/v1/profile              - Get user profile
PATCH /api/v1/profile             - Update profile
GET  /api/v1/xp                   - Get user's XP/level
POST /api/v1/xp                   - Award XP for action
GET  /api/v1/quiz                 - List all quizzes
GET  /api/v1/quiz/daily           - Get today's question
GET  /api/v1/quiz/{id}            - Get specific quiz
POST /api/v1/quiz/{id}            - Submit quiz answers
```

See `IMPLEMENTATION_GUIDE.md` for full API documentation.

## File Structure

```
✅ supabase/migrations/002_xp_quiz_profile.sql
✅ src/app/api/v1/profile/route.ts
✅ src/app/api/v1/xp/route.ts
✅ src/app/api/v1/quiz/route.ts
✅ src/app/api/v1/quiz/[id]/route.ts
✅ src/app/api/v1/quiz/daily/route.ts
✅ src/app/profile/page.tsx (rewritten)
✅ src/app/quiz/page.tsx
✅ src/app/quiz/[id]/page.tsx
✅ src/lib/api.ts (updated)
✅ src/components/Header.tsx (updated)
✅ scripts/seed-quizzes.ts
```

## Common Tasks

### Award XP When Article is Read
```typescript
import { api } from "@/lib/api";

// In article view component
await api.xp.award("read_article", { article_id: articleId }, token);
```

### Award XP for Bookmark
```typescript
await api.xp.award("bookmark", { article_id: articleId }, token);
```

### Check User's Level
```typescript
const xpData = await api.xp.get(token);
console.log(`User is level ${xpData.level} - ${xpData.title}`);
```

### Create Custom Quizzes
Add directly to the database or create more seed data:
```typescript
await supabase.from("quizzes").insert({
  title: "Your Quiz Title",
  quiz_type: "weekly",
  questions: [/* array of question objects */],
  published_at: new Date().toISOString(),
  expires_at: null,
});
```

## Troubleshooting

### Migration fails
- Ensure Supabase CLI is installed: `npm install -g supabase`
- Check environment variables in `.env.local`

### Seed script fails
- Install ts-node: `npm install -D ts-node`
- Ensure SUPABASE_SERVICE_ROLE_KEY is set

### Quiz page shows "No quizzes"
- Run the seed script: `npx ts-node scripts/seed-quizzes.ts`

### Profile page is blank
- Make sure you're logged in
- Check browser console for errors
- Verify migration was applied

## Documentation

- **Full setup guide**: `IMPLEMENTATION_GUIDE.md`
- **Technical details**: `IMPLEMENTATION_SUMMARY.md`
- **This file**: `QUICK_START.md`

## Next Steps

1. ✅ Apply migration
2. ✅ Seed sample quizzes
3. ✅ Test the UI
4. ✅ Integrate XP awards in article viewing
5. 📅 Add more quizzes via admin panel
6. 🎯 Create achievement/badge system (future)
7. 🏆 Add leaderboard (future)

## Support

All code is:
- Type-safe with TypeScript
- Documented with comments
- Following Next.js 16 best practices
- Protected with Supabase RLS
- Styled with Tailwind CSS

Enjoy! 🚀
