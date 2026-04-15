# NyhetsAppen - XP/Level System, Quiz System & Enhanced Profile Implementation Guide

This document describes the complete implementation of the XP/Level system, Quiz system, and enhanced Profile page for NyhetsAppen.

## Overview

The implementation includes:

1. **Database migrations** - New tables for user profiles, XP tracking, and quizzes
2. **XP/Level system API** - Track and award XP to users
3. **Quiz system API** - Daily questions and weekly quizzes with scoring
4. **Enhanced Profile page** - New UI with stats, activity heatmap, and user info
5. **Quiz pages** - List page and interactive quiz experience
6. **Navigation updates** - Quiz link added to header

## Files Created/Modified

### Database Migrations
- `supabase/migrations/002_xp_quiz_profile.sql` - Complete schema with RLS policies

### API Routes (Next.js)
- `src/app/api/v1/profile/route.ts` - User profile management (GET/PATCH)
- `src/app/api/v1/xp/route.ts` - XP tracking and level calculations (GET/POST)
- `src/app/api/v1/quiz/route.ts` - List available quizzes (GET)
- `src/app/api/v1/quiz/[id]/route.ts` - Get quiz details and submit answers (GET/POST)
- `src/app/api/v1/quiz/daily/route.ts` - Get today's daily question (GET)

### Client Library
- `src/lib/api.ts` - Updated with new endpoints and TypeScript interfaces

### Pages (React)
- `src/app/profile/page.tsx` - Rewritten with heatmap, stats, and category distribution
- `src/app/quiz/page.tsx` - Quiz list and daily question
- `src/app/quiz/[id]/page.tsx` - Interactive quiz experience

### Components
- `src/components/Header.tsx` - Added Quiz navigation link

### Scripts
- `scripts/seed-quizzes.ts` - Seed sample quizzes into database

## Database Schema

### user_profiles
Stores user profile information and XP data:
```sql
- id (UUID, primary key)
- display_name (text)
- avatar_url (text)
- bio (text)
- xp (integer, default 0)
- level (integer, default 1)
- streak_days (integer, default 0)
- last_read_date (date)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### xp_log
Audit log of all XP-earning events:
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- action (text)
- xp_earned (integer)
- metadata (jsonb)
- created_at (timestamptz)
```

### quizzes
Quiz definitions with questions:
```sql
- id (UUID, primary key)
- title (text)
- quiz_type (text: 'daily' | 'weekly')
- questions (jsonb - array of questions)
- published_at (timestamptz)
- expires_at (timestamptz, nullable)
- created_at (timestamptz)
```

### quiz_attempts
Records user quiz completions:
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- quiz_id (UUID, foreign key)
- answers (jsonb - array of answer indices)
- score (integer - percentage)
- xp_earned (integer)
- completed_at (timestamptz)
```

## XP System

### Level Progression
```
Level 1: 0 XP - Nybegynner
Level 2: 500 XP - Leser
Level 3: 1500 XP - Nyhetssniffer
Level 4: 3500 XP - Analytiker
Level 5: 7000 XP - Redaktør
Level 6: 13000 XP - Innsiktsfull
Level 7: 22000 XP - Kunnskapsmeister
```

### XP Awards
- **read_article**: 5 XP per article
- **complete_quiz**: 50 XP per correct answer
- **daily_question**: 20 XP per daily question
- **streak_7**: 100 XP bonus for 7-day streak
- **streak_30**: 500 XP bonus for 30-day streak
- **speed_improvement**: 25 XP for reading faster
- **bookmark**: 2 XP per bookmark
- **category_explorer**: 15 XP for reading 3+ categories in a day
- **complete_profile**: 30 XP one-time for completing profile

## API Endpoints

### Profile API

#### GET /api/v1/profile
Returns user profile (creates one if doesn't exist).

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "id": "uuid",
  "display_name": "John Doe",
  "avatar_url": "https://...",
  "bio": "My bio",
  "xp": 1000,
  "level": 2,
  "streak_days": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

#### PATCH /api/v1/profile
Update user profile fields.

**Body**:
```json
{
  "display_name": "New Name",
  "avatar_url": "https://...",
  "bio": "New bio"
}
```

### XP API

#### GET /api/v1/xp
Get user's current XP and level info.

**Response**:
```json
{
  "xp": 1000,
  "level": 2,
  "title": "Leser",
  "nextLevelXp": 1500,
  "xpToNextLevel": 500,
  "streakDays": 5
}
```

#### POST /api/v1/xp
Award XP for an action.

**Body**:
```json
{
  "action": "read_article",
  "metadata": { "article_id": "123" }
}
```

**Response**:
```json
{
  "xp": 1005,
  "xpEarned": 5,
  "level": 2,
  "title": "Leser",
  "nextLevelXp": 1500,
  "xpToNextLevel": 495,
  "leveledUp": false
}
```

### Quiz API

#### GET /api/v1/quiz
List all available quizzes with completion status.

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "Norsk geografi",
    "quizType": "weekly",
    "questionCount": 4,
    "publishedAt": "2024-01-01T00:00:00Z",
    "expiresAt": null,
    "completed": false,
    "score": null,
    "xpEarned": null
  }
]
```

#### GET /api/v1/quiz/daily
Get today's daily question.

**Response**:
```json
{
  "id": "uuid",
  "title": "Dagens spørsmål",
  "quizType": "daily",
  "question": {
    "id": "q1",
    "question": "Hva er hovedstaden i Norge?",
    "options": ["Oslo", "Bergen", "Stavanger", "Trondheim"],
    "correctAnswer": 0,
    "explanation": "Oslo er hovedstaden..."
  },
  "questionCount": 1,
  "publishedAt": "2024-01-02T06:00:00Z",
  "completed": false
}
```

#### GET /api/v1/quiz/{id}
Get specific quiz with all questions.

**Response**:
```json
{
  "id": "uuid",
  "title": "Norsk geografi",
  "quizType": "weekly",
  "questions": [
    {
      "id": "q1",
      "question": "Hvor ligger Nordkapp?",
      "options": ["Finnmark", "Troms", "Nordland", "Svalbard"],
      "correctAnswer": 0,
      "explanation": "Nordkapp ligger i Finnmark..."
    }
  ],
  "completed": false
}
```

#### POST /api/v1/quiz/{id}
Submit quiz answers and get score.

**Body**:
```json
{
  "answers": [0, 1, 2, 0]
}
```

**Response**:
```json
{
  "score": 75,
  "xpEarned": 150,
  "correctCount": 3,
  "totalQuestions": 4
}
```

## Setup Instructions

### 1. Apply Database Migrations

```bash
# Using Supabase CLI
supabase migration up

# Or manually run the SQL in Supabase console:
# supabase/migrations/002_xp_quiz_profile.sql
```

### 2. Seed Sample Quizzes

First, ensure you have environment variables set:

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Then run:

```bash
npx ts-node scripts/seed-quizzes.ts
```

This will seed:
- 3 daily questions (one per day for the past 3 days)
- 3 weekly quizzes with Norwegian history, geography, and culture questions

### 3. Build the App

```bash
npm install
npm run build
```

### 4. Test the Features

1. **Profile Page**: Navigate to `/profile` - You'll see the new enhanced profile with:
   - Profile header with avatar and level badge
   - XP progress bar
   - Stats grid (articles read, bookmarks, streak, level)
   - Activity heatmap (12 weeks of reading activity)
   - Category distribution chart
   - Reading history (last 20 articles)

2. **Quiz Page**: Navigate to `/quiz` - You'll see:
   - Today's daily question with answer reveal
   - List of available weekly quizzes
   - Completion status for each quiz

3. **Quiz Detail**: Click on a quiz to see:
   - Progressive multi-question quiz interface
   - Progress bar
   - Immediate feedback on answers
   - Score at the end with XP earned

## UI Features

### Profile Page

**Profile Header**:
- Circular avatar with user initial
- Display name (editable)
- Level badge with title
- XP progress bar to next level

**Stats Grid** (2x2 on mobile, 1x4 on desktop):
- Articles read
- Bookmarks count
- Current streak
- Current level

**Activity Heatmap**:
- GitHub-style contribution graph
- 12 weeks of daily activity
- Green intensity based on articles read
- Pure CSS/Tailwind implementation

**Category Distribution**:
- Horizontal progress bars
- Top 6 categories
- Color-coded by category

**Reading History**:
- Last 20 articles read
- Click to view article
- Timestamp for each read

### Quiz Pages

**Quiz List**:
- Daily question prominently displayed
- Weekly quizzes in grid layout
- Completion status and scores shown
- Visual progress bars

**Quiz Detail**:
- Progress bar for overall quiz progress
- Question-by-question interface
- 4 answer options with visual feedback
- Immediate answer feedback with explanation
- Question indicator buttons
- Results screen with score and XP earned

## Styling

All styling is done with **Tailwind CSS**. Key color schemes:

- **Primary**: Blue/Purple gradients
- **XP/Level**: Blue to purple gradient
- **Status**: Green for correct, Red for incorrect
- **Heatmap**: Green intensity scale

## Integrating with Article Reading

To award XP when users read articles, add this call when an article is viewed:

```typescript
// In article component when user opens/reads
await api.xp.award("read_article", { article_id: articleId }, token);
```

For category explorer bonus (when user reads 3+ categories in a day):

```typescript
// Check categories read today, then:
await api.xp.award("category_explorer", { date: today }, token);
```

## TypeScript Types

All new types are exported from `src/lib/api.ts`:

```typescript
- UserProfile
- XPResponse
- Question
- Quiz
- QuizSubmitResponse
```

These can be imported in your components as needed.

## Notes

- All dates and timestamps use ISO 8601 format with UTC timezone
- XP awards are logged in the `xp_log` table for audit purposes
- Quiz attempts have a unique constraint (user_id, quiz_id) to prevent duplicates
- RLS policies ensure users can only see/modify their own data
- Daily quizzes are automatically served to the current user
- The activity heatmap is calculated client-side from reading history

## Future Enhancements

1. AI-generated quiz questions based on latest articles
2. User badges/achievements system
3. Leaderboard/competitive features
4. More complex XP calculations with time-based decay
5. Customizable profile avatars/themes
6. Quiz difficulty levels
7. Timed quizzes with bonus XP
8. Social features (share results, compare scores)
