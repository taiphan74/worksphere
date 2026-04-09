# Auth Routing & Onboarding Guard Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route authenticated users correctly through landing → onboarding → workspace, and auto-redirect after email verification.

**Architecture:** Use server components at route entry points to fetch auth state and user data, then redirect based on business rules. No client-side changes except verify-email success redirect.

**Tech Stack:** Next.js 16 App Router, Server Components, `next/navigation` redirect, existing `apiClientWithAuth`, `auth-checker.ts`, `server-onboarding.ts`

---

## System Flow

### Landing page (`/vi` or `/en`)

```
User visits / or /vi
  ├── Không có cookie → Hiện landing page (public)
  └── Có cookie
        ├── GET /auth/me thất bại → Hiện landing page (token invalid, user cần login lại)
        └── Thành công
              ├── Có full_name + có workspace → redirect /vi/w/[first-workspace-slug]
              ├── Có full_name + không workspace → redirect /vi/onboarding
              └── Không có full_name → redirect /vi/onboarding
```

### Verify email (`/verify-email`)

```
POST /auth/verify-email?token=xxx
  ├── Success → redirect /
  └── Error → Giữ nguyên trang, hiện lỗi
```

### Onboarding (`/onboarding`)

```
User visits /onboarding
  ├── Không có cookie → redirect /login
  ├── GET /auth/me thất bại → redirect /login
  ├── Đã onboard xong (có name + có workspace) → redirect /vi/w/[first-workspace-slug]
  └── Chưa onboard → Cho vào wizard
```

## Architecture Decisions

1. **Server component ở landing page** thay vì middleware — middleware không nên gọi API, chỉ kiểm tra cookie tồn tại.
2. **Re-use `apiClientWithAuth`** cho server-side fetch — gửi cookie HttpOnly tự động.
3. **Onboarding guard** dùng pattern tương tự `WorkspaceLayout`: server component wrapper, kiểm tra auth + onboarded status trước khi render wizard.
4. **Verify email** chỉ thay đổi: thêm redirect on success (client-side `window.location.href = "/"` sau khi verify thành công).
