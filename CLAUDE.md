# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 + Supabase authentication starter kit. 
Modern web app template with cookie-based auth, server-side rendering support, and shadcn/ui components.
The app must have the ability to run in different width of screens even on a mobile phone.
This project includes
 - authentication methods using supabase
 - page New Proposal with a form so the user should fill them and a button Add to add the form record in the supabase database.
 - page Dashboard that shows all rows in the database and also buttons Edit and Delete. With Edit user is transfered in page New Proposal where the button will be renamed as Update and the user may change the any current field value.
 - PDF generation: After submitting a new or updated proposal, a PDF file is created containing the form data with the company logo on top.
 Only Authenticated users can insert/update/delete rows.
 The Agro database will have the columns Area, Plant, Name, e-mail, Date (current date of the insertion).
 Header and NavBar will be same in all pages. Footer is static but NavBar will have at the left the logo that links to the Homepage and on the right New Proposal link, Dashboard link and Login. Login will renamed as Logout if the user is authenticated. 

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test framework configured yet.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Auth/Backend:** Supabase SSR with cookie-based sessions
- **Styling:** Tailwind CSS + shadcn/ui (New York style)
- **Forms:** React Hook Form + Yup validation
- **Notifications:** React Hot Toast, SweetAlert2

## Architecture

### Supabase Client Pattern
- `lib/supabase/client.ts` - Browser client (use in client components)
- `lib/supabase/server.ts` - Server client (use in server components/actions)
- `lib/supabase/middleware.ts` - Session refresh logic

### Authentication Flow
Middleware (`middleware.ts`) validates sessions on every request. Protected routes redirect unauthenticated users to `/auth/login`. Public routes: `/`, `/auth/*`, static assets.

### Directory Structure
- `app/` - Next.js App Router pages and API routes
- `app/auth/` - Authentication pages (login, sign-up, forgot-password, etc.)
- `components/` - React components
- `components/ui/` - shadcn/ui primitives
- `lib/` - Utilities and Supabase clients
- `context/` - React context providers (auth state)

### Import Aliases
- `@/*` maps to project root (configured in tsconfig.json and components.json)

## Supabase Configuration

Environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Image optimization configured for Supabase storage domain in `next.config.ts`.

## Current State

Several files are deleted but still tracked by git (Dashboard pages, context/AppUtils.tsx, lib/utils.ts, product repo/service). Components that import from these deleted files will fail. Check git status for details.

## Conventions

- Client components marked with `"use client"` directive
- shadcn/ui components use `cn()` utility from `lib/utils.ts` for class merging
- Form submissions use async/await with try/catch and toast notifications
- Supabase queries return `{ data, error }` - always check error first

## Workflow

1. First think through the problem. Read the codebase and write a plan in tasks/todo.md.
2. The plan should be a checklist of todo items.
3. Check in with me before starting work. I will verify the plan.
4. Then complete the todos one by one, marking them off as you do.
5. At every step, give me a high level explanation of what you changed.
6. Keep every change simple and minimal. Avoid big rewrites.
7. At the end add a review section in todo.md summarizing the changes.  