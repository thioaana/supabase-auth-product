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

## Phase 2: Service Layer Refactoring

### Tasks

- [x] 1. Create `lib/services/agroService.ts` with CRUD functions
- [x] 2. Update `proposal-form.tsx` to use service for insert/update
- [x] 3. Update `dashboard-table.tsx` to use service for delete
- [x] 4. Update `dashboard/page.tsx` to use service for fetching proposals
- [x] 5. Update `new-proposal/page.tsx` to use service for fetching single proposal
- [x] 6. Test build passes

### Phase 2 Review

**Created `lib/services/agroService.ts`** - Server-side service with:
- `getProposalsByUser()` - fetch all user proposals
- `getProposalById()` - fetch single proposal for edit
- `createProposal()` - Server Action for insert
- `updateProposal()` - Server Action for update
- `deleteProposal()` - Server Action for delete

**Updated components:**
- `proposal-form.tsx` - removed client Supabase, calls `createProposal`/`updateProposal` Server Actions
- `dashboard-table.tsx` - removed client Supabase, calls `deleteProposal` Server Action
- `dashboard/page.tsx` - uses `getProposalsByUser()` service
- `new-proposal/page.tsx` - uses `getProposalById()` service, removed `userId` prop

**Benefits:**
- All database operations are server-side only (more secure)
- No client Supabase imports in components
- Centralized data access logic
- Reusable service functions

---

## Phase 1 Review

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

---

## Phase 3: PDF Generation

### Overview
Generate a PDF containing proposal data with company logo after form submission (create/update).

### Tasks

- [x] 1. Install `jspdf` library for client-side PDF generation
- [ ] 2. Add company logo to project (user needs to provide logo file) - OPTIONAL
- [x] 3. Create `lib/utils/generatePdf.ts` - PDF generation utility
- [x] 4. Update `proposal-form.tsx` to generate and download PDF after successful submit
- [x] 5. Test PDF generation (build passes)

### PDF Content Layout
- Company logo at top (centered)
- Title: "Agro Proposal"
- Date of submission
- Form fields: Area, Plant, Name, Email

### Notes
- Using `jspdf` (client-side) - simple, no server needed
- Logo needs to be provided by user (PNG/JPG format recommended)
- PDF downloads automatically after form submit

### Phase 3 Review

**Created `lib/utils/generatePdf.ts`** - PDF generation utility with:
- Green "AGRO" header text (can be replaced with logo image later)
- "Agricultural Proposals" subtitle
- Proposal details: Area, Plant, Name, Email
- Current date
- Footer with system attribution

**Updated `proposal-form.tsx`**:
- Imports `generateProposalPdf` utility
- Calls PDF generation after successful create/update
- PDF auto-downloads with filename: `proposal_[name]_[timestamp].pdf`

**To add a logo later:**
1. Add logo image to project (e.g., `public/logo.png`)
2. Update `generatePdf.ts` to use `doc.addImage()` instead of text header
