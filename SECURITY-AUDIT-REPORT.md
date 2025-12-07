# Security Audit Report: Next.js + Supabase Application

**Date:** 2025-12-07
**Application:** supa-auth-agro-claude

## Executive Summary

This security audit identified **14 security issues** across the codebase, ranging from critical vulnerabilities to low-severity improvements. The application has good foundational security practices with proper use of Supabase SSR and server-side authentication, but requires attention in several areas before production deployment.

---

## Findings by Severity

### CRITICAL (2 issues)

| # | Issue | File | Line | Description |
|---|-------|------|------|-------------|
| 1 | **RCE Vulnerability in Next.js** | package.json | 22 | Next.js canary versions (16.0.0-16.0.6) are vulnerable to Remote Code Execution via React flight protocol (GHSA-9qr9-h5gf-34mp) |
| 2 | **glob CLI Command Injection** | package.json | - | glob package (10.2.0-10.4.5) is vulnerable to command injection via -c/--cmd flag (GHSA-5j98-mcp5-4vw2) |

**Immediate Fix:** Run `npm audit fix --force` to patch both vulnerabilities

---

### HIGH (5 issues)

| # | Issue | File | Line | Description |
|---|-------|------|------|-------------|
| 3 | **Open Redirect Vulnerability** | app/auth/confirm/route.ts | 10, 21 | The `next` query parameter is used directly in `redirect()` without validation, enabling phishing attacks |
| 4 | **Error Message Information Disclosure** | Multiple auth files | Various | Raw Supabase errors exposed to users, revealing system implementation details |
| 5 | **Missing RLS Policies** | Supabase Dashboard | - | Application relies only on server-side `.eq("user_id")` checks without database-level Row Level Security |
| 6 | **PDF URL Not Validated** | dashboard-table.tsx | 87-95 | PDF URLs from database displayed without validating they point to Supabase storage |
| 7 | **Incorrect Redirect Paths** | sign-up-form.tsx, update-password-form.tsx | 49, 37 | `/Dashboard` (wrong case) and `/protected` (non-existent) routes in redirects |

---

### MEDIUM (5 issues)

| # | Issue | File | Line | Description |
|---|-------|------|------|-------------|
| 8 | **Hardcoded Supabase Domain** | next.config.ts | 6 | Supabase project ID exposed in image configuration |
| 9 | **Console.log in Production** | proposal-form.tsx, NavBar.tsx | 38, 12 | Debug statements exposed in browser console |
| 10 | **Unsafe window.location Usage** | proposal-form.tsx, auth forms | Various | Inconsistent use of `window.location.href` vs Next.js router |
| 11 | **Missing File Ownership Validation** | storageService.ts | 66, 122 | PDF deletion doesn't verify file belongs to current user |
| 12 | **Missing PDF File Validation** | storageService.ts | 33-35 | No validation that uploaded content is actually a PDF |

---

### LOW (4 issues)

| # | Issue | File | Line | Description |
|---|-------|------|------|-------------|
| 13 | **Missing Security Headers** | next.config.ts | - | No CSP, X-Frame-Options, HSTS, etc. |
| 14 | **No Rate Limiting** | middleware.ts | - | No brute force protection on auth endpoints |
| 15 | **Predictable PDF Filenames** | generatePdf.ts | 114 | Uses `Date.now()` which is guessable |
| 16 | **Missing Input Validation** | proposal-form.tsx | 88-131 | React Hook Form + Yup not used despite being in dependencies |

---

## Recommended Fixes

### Immediate Actions (Fix Today)

1. **Patch dependencies:**
   ```bash
   npm audit fix --force
   ```

2. **Fix open redirect** in `app/auth/confirm/route.ts`:
   ```typescript
   const next = searchParams.get("next") ?? "/";
   const allowedPaths = ["/", "/dashboard", "/new-proposal"];
   const safeNext = next.startsWith("/") && allowedPaths.includes(next) ? next : "/";
   redirect(safeNext);
   ```

3. **Fix incorrect redirect paths:**
   - `app/auth/sign-up/sign-up-form.tsx:49` - Change `/Dashboard` to `/dashboard`
   - `app/auth/update-password/update-password-form.tsx:37` - Change `/protected` to `/dashboard`

### Short-Term (This Week)

4. **Implement generic error messages** in all auth forms:
   ```typescript
   setError("An authentication error occurred. Please try again.");
   ```

5. **Add security headers** to `next.config.ts`:
   ```typescript
   async headers() {
     return [{
       source: "/:path*",
       headers: [
         { key: "X-Content-Type-Options", value: "nosniff" },
         { key: "X-Frame-Options", value: "DENY" },
         { key: "Strict-Transport-Security", value: "max-age=31536000" },
       ],
     }];
   }
   ```

6. **Validate PDF URLs** before rendering in dashboard:
   ```typescript
   const isValidPdfUrl = (url: string) => {
     try {
       const parsed = new URL(url);
       return parsed.hostname.endsWith('.supabase.co');
     } catch { return false; }
   };
   ```

7. **Remove console.log statements** or guard with environment check

### Pre-Production (Required Before Launch)

8. **Enable RLS in Supabase** for the `agro` table:
   ```sql
   ALTER TABLE agro ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own proposals"
     ON agro FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own proposals"
     ON agro FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own proposals"
     ON agro FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own proposals"
     ON agro FOR DELETE USING (auth.uid() = user_id);
   ```

9. **Add file ownership validation** in `storageService.ts`:
   ```typescript
   const filePath = urlParts[1];
   const userIdFromPath = filePath.split('/')[0];
   if (userIdFromPath !== user.id) {
     return { success: false, error: "Unauthorized" };
   }
   ```

10. **Validate PDF content** before upload:
    ```typescript
    const pdfHeader = bytes.slice(0, 4);
    const isPdf = pdfHeader[0] === 0x25 && pdfHeader[1] === 0x50 &&
                  pdfHeader[2] === 0x44 && pdfHeader[3] === 0x46;
    if (!isPdf) {
      return { success: false, error: "Invalid PDF file" };
    }
    ```

---

## Files Requiring Changes

| Priority | File | Changes |
|----------|------|---------|
| Critical | `package.json` | Run npm audit fix |
| High | `app/auth/confirm/route.ts` | Fix open redirect |
| High | `app/auth/sign-up/sign-up-form.tsx` | Fix redirect path case |
| High | `app/auth/update-password/update-password-form.tsx` | Fix redirect path |
| High | Multiple auth forms | Implement generic error messages |
| Medium | `next.config.ts` | Add security headers |
| Medium | `app/dashboard/dashboard-table.tsx` | Validate PDF URLs |
| Medium | `lib/services/storageService.ts` | Add ownership + PDF validation |
| Medium | `app/new-proposal/proposal-form.tsx` | Remove console.log |
| Medium | `components/NavBar.tsx` | Remove console.error |

---

## Supabase Configuration Required

1. **Enable RLS** on `agro` table
2. **Create RLS policies** for SELECT, INSERT, UPDATE, DELETE
3. **Review storage bucket policies** for the `proposals` bucket
4. **Verify anon key permissions** are minimal

---

## Summary

- **Total Issues:** 14
- **Critical:** 2 (dependency vulnerabilities)
- **High:** 5 (open redirect, error disclosure, missing RLS, wrong redirects)
- **Medium:** 5 (hardcoded values, console logs, missing validations)
- **Low:** 4 (headers, rate limiting, predictable filenames, input validation)

The most urgent actions are patching the npm vulnerabilities and fixing the open redirect vulnerability. RLS policies should be enabled in Supabase before any production deployment.
