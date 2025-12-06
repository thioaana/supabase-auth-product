# Agro Web App Implementation Plan

## Overview
Create a responsive web app for agricultural proposals using Next.js 15 + Supabase.
No context providers - fetch auth state directly from Supabase where needed.

## Database Schema (Supabase)
Table: `agro` with columns:
- `id` (uuid, primary key)
- `area` (text)
- `plant` (text)
- `name` (text)
- `email` (text)
- `created_at` (timestamp)
- `user_id` (uuid, foreign key to auth.users)

## Tasks

- [x] 1. Create `lib/utils.ts` with `cn()` only (required by shadcn/ui)
- [x] 2. Update `layout.tsx` - remove AppUtilsProvider
- [x] 3. Update `NavBar` - fetch auth state directly from Supabase
- [x] 4. Update `middleware.ts` - remove hasEnvVars dependency
- [x] 5. Create `app/new-proposal/page.tsx` - Form for adding/editing proposals
- [x] 6. Create `app/dashboard/page.tsx` - Table with Edit/Delete buttons
- [x] 7. Test complete flow (build passes)

## Notes
- Only authenticated users can CRUD proposals
- Edit navigates to New Proposal with pre-filled form (via query params)
- User must create Supabase table manually

## Review

### Changes Made

1. **lib/utils.ts** - Created with `cn()` function only (no `hasEnvVars`)

2. **layout.tsx** - Removed `AppUtilsProvider`, simplified layout

3. **NavBar** - Split into two components:
   - `NavBar.tsx` (server) - fetches user securely via Supabase server client
   - `NavBarClient.tsx` (client) - handles hamburger menu toggle, renders links

4. **middleware.ts** - Removed `hasEnvVars` dependency

5. **New Proposal page** (`app/new-proposal/`):
   - `page.tsx` - Server component, fetches user and existing data for edit mode
   - `proposal-form.tsx` - Client form with Area, Plant, Name, Email fields

6. **Dashboard page** (`app/dashboard/`):
   - `page.tsx` - Server component, fetches user's proposals
   - `dashboard-table.tsx` - Client table with Edit/Delete buttons

7. **Profile page** - Fixed to use server-side auth instead of AppUtils

### Supabase Table Required

Create table `agro` with:
```sql
CREATE TABLE agro (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area TEXT NOT NULL,
  plant TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS
ALTER TABLE agro ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see/edit their own rows
CREATE POLICY "Users can manage own proposals" ON agro
  FOR ALL USING (auth.uid() = user_id);
```
