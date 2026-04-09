# Auth Routing & Onboarding Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route authenticated users correctly through landing → onboarding → workspace, and auto-redirect after email verification.

**Architecture:** Server components at route entry points fetch auth state and user data, then redirect based on business rules. Verify-email success auto-redirects to landing (which handles further routing).

**Tech Stack:** Next.js 16 App Router, Server Components, `next/navigation` redirect, `apiClientWithAuth`, `auth-checker.ts`, `server-onboarding.ts`

---

### Task 1: Fix verify-email success redirect

**Files:**
- Modify: `src/features/auth/pages/verify-email/page.tsx:35-47`

- [ ] **Step 1: Add redirect on verify success**

In `src/features/auth/pages/verify-email/page.tsx`, after setting `setStatus("success")`, redirect to home page:

```tsx
// Inside the useEffect, in the success branch (around line 42):
if (response.verified) {
  setStatus("success");
  setMessage(t("verifySuccessMessage"));
  // Redirect sau 1.5s để user thấy thông báo thành công
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
}
```

The full modified section inside the useEffect:

```tsx
if (response.verified) {
  setStatus("success");
  setMessage(t("verifySuccessMessage"));
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
} else {
  setStatus("error");
  setMessage(t("verifyFailedMessage"));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/pages/verify-email/page.tsx
git commit -m "fix: redirect to home after successful email verification"
```

---

### Task 2: Add server-side auth check helper for landing

**Files:**
- Create: `src/lib/auth/landing-auth-checker.ts`

- [ ] **Step 1: Create landing auth checker**

Create `src/lib/auth/landing-auth-checker.ts`:

```ts
import { cookies } from "next/headers";
import { apiClientWithAuth } from "@/lib/http/api-client";
import { workspaceService } from "@/features/workspace/services/workspace-service";
import type { AuthUser } from "@/features/auth/types/auth.types";

type LandingAuthResult =
  | { status: "not_authenticated" }
  | { status: "authenticated"; user: AuthUser; workspaces: { id: string; slug: string }[] };

/**
 * Kiểm tra auth state cho landing page.
 * Trả về thông tin user + workspace nếu có token hợp lệ.
 * Nếu không có token hoặc token lỗi → { status: "not_authenticated" }.
 */
export async function getLandingAuthState(): Promise<LandingAuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { status: "not_authenticated" };
  }

  try {
    // Fetch user profile
    const { data: userData } = await apiClientWithAuth.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user: AuthUser = {
      id: userData.data.id,
      email: userData.data.email,
      fullName: userData.data.full_name,
      avatarKey: userData.data.avatar_key,
      isVerified: userData.data.is_verified,
      createdAt: userData.data.created_at,
      updatedAt: userData.data.updated_at,
    };

    // Fetch workspaces
    const workspacesResponse = await workspaceService.getWorkspaces();
    const workspaces = workspacesResponse?.map((w) => ({
      id: w.id,
      slug: w.slug,
    })) ?? [];

    return { status: "authenticated", user, workspaces };
  } catch {
    return { status: "not_authenticated" };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth/landing-auth-checker.ts
git commit -m "feat: add server-side auth checker for landing page routing"
```

---

### Task 3: Implement landing page server component with routing

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Rewrite landing page as server component**

Replace the entire content of `src/app/[locale]/page.tsx` with:

```tsx
import { redirect } from "next/navigation";
import { getLandingAuthState } from "@/lib/auth/landing-auth-checker";
import { AuthFlashNotice } from "@/components/auth/auth-flash-notice";
import { LandingHeader } from "@/components/layout/landing-header";
import { FogOverlay } from "@/components/landing/fog-overlay";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { workspaceBackgroundGradient } from "@/styles/glass";

async function LandingRedirect({ locale }: { locale: string }) {
  const auth = await getLandingAuthState();

  if (auth.status === "not_authenticated") {
    return null;
  }

  // Đã có user → kiểm tra đã onboard chưa
  const hasName = !!auth.user.fullName;
  const hasWorkspace = auth.workspaces.length > 0;

  if (hasName && hasWorkspace) {
    redirect(`/${locale}/w/${auth.workspaces[0].slug}`);
  }

  if (hasName && !hasWorkspace) {
    redirect(`/${locale}/onboarding`);
  }

  // Không có name → cần onboarding
  redirect(`/${locale}/onboarding`);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <LandingRedirect locale={locale} />
      <main className={`relative min-h-screen overflow-hidden ${workspaceBackgroundGradient}`}>
        <FogOverlay />
        <LandingHeader />
        <section className="relative z-10 min-h-screen px-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center min-h-screen">
            <AuthFlashNotice />
            <HeroHeadline />
          </div>
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/page.tsx
git commit -m "feat: redirect authenticated users from landing to workspace or onboarding"
```

---

### Task 4: Add onboarding server-side guard

**Files:**
- Modify: `src/app/[locale]/onboarding/page.tsx`

- [ ] **Step 1: Add server-side guard to onboarding page**

Replace `src/app/[locale]/onboarding/page.tsx` with:

```tsx
import { redirect } from "next/navigation";
import { getLandingAuthState } from "@/lib/auth/landing-auth-checker";
import { isUserOnboarded } from "@/lib/auth/server-onboarding";
import OnboardingPage from "@/features/onboarding/pages/onboarding/page";

async function OnboardingGuard({ locale }: { locale: string }) {
  const auth = await getLandingAuthState();

  if (auth.status === "not_authenticated") {
    redirect(`/${locale}/login`);
  }

  // Đã onboard xong → redirect vào workspace đầu tiên
  const onboarded = await isUserOnboarded();
  if (onboarded && auth.workspaces.length > 0) {
    redirect(`/${locale}/w/${auth.workspaces[0].slug}`);
  }
}

export default async function OnboardingRoutePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <OnboardingGuard locale={locale} />
      <OnboardingPage />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/onboarding/page.tsx
git commit -m "feat: add server-side guard to onboarding page"
```

---

### Task 5: Update middleware to not redirect logged-in users to /w

**Files:**
- Modify: `src/proxy.ts`

- [ ] **Step 1: Fix middleware redirect target**

In `src/proxy.ts`, line 83, change the redirect URL from `/w` to `/`:

```ts
// Before:
const homeUrl = new URL(`/${locale}/w`, request.url);

// After:
const homeUrl = new URL(`/${locale}`, request.url);
```

Full modified line:

```ts
    if (accessToken && isAuth) {
      // Redirect to landing page if already logged in and trying to access auth routes
      // Landing page will handle further routing (workspace or onboarding)
      const homeUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(homeUrl);
    }
```

- [ ] **Step 2: Commit**

```bash
git add src/proxy.ts
git commit -m "fix: redirect logged-in users from auth routes to landing instead of /w"
```

---

### Task 6: Test the full flow

**Files:** (no code changes)

- [ ] **Step 1: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: No errors (or same errors as before — pre-existing).

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No new lint errors.

- [ ] **Step 3: Manual testing flow**

Start dev server: `npm run dev`

Test flow 1 — New user:
1. Register → verify email via link
2. Should redirect to `/` → then `/onboarding`
3. Complete onboarding → should redirect to `/w/[slug]`

Test flow 2 — Existing user with workspace:
1. Login → should redirect to `/` → then `/w/[slug]`

Test flow 3 — Logged-in user visiting auth routes:
1. Go to `/login` while logged in → should redirect to `/` → `/w/[slug]`

Test flow 4 — Onboarded user visiting `/onboarding`:
1. Go to `/onboarding` while already onboarded → should redirect to `/w/[slug]`

- [ ] **Step 4: Commit if any fixes needed**

---

### Task 7: Final commit

- [ ] **Step 1: Create final commit with any remaining changes**

```bash
git add -A
git commit -m "chore: finalize auth routing improvements"
```
