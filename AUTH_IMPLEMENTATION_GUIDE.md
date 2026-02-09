# Authentication Best Practices & Usage Guide

## Fixed Issues Summary

### ✅ Completed Fixes

1. **Created `middleware.ts`** - Handles session updates on every request
2. **Fixed `lib/supabase/client.ts`** - Corrected environment variable
3. **Fixed `lib/supabase/proxy.ts`** - Corrected environment variable
4. **Enabled dashboard auth checks** - Validates session and superadmin role
5. **Created `SessionProvider`** - Global session context
6. **Updated `app/layout.tsx`** - Uses SessionProvider instead of commented AuthProvider
7. **Updated `components/app-sidebar.tsx`** - Uses real user data from session
8. **Fixed `nav-user.tsx` logout** - Already implemented correctly

---

## Usage Examples

### 1. Access User Session in Client Components

```tsx
"use client"

import { useSession } from "@/components/providers/SessionProvider"

export function MyComponent() {
  const { user, session, loading, error } = useSession()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <p>Hello, {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}
```

### 2. Correct Way to Fetch Data (Server-Side)

```typescript
// ✅ CORRECT - Use server client for data fetches
import { createClient } from "@/lib/supabase/server"
import { SupportTicketWithProfile } from "@/types/support"

export const fetchSupport = async (
  page: number,
  perPage: number
): Promise<{
  data: SupportTicketWithProfile[] | null
  count: number | null
  error: any
}> => {
  // Create server client (has access to session via middleware)
  const supabase = await createClient()
  
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false })

  return { data, count, error }
}
```

### 3. Protected Page with Role Check

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "@/components/providers/SessionProvider"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useSession()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </div>
  )
}
```

### 4. Login Workflow (Already Correct)

```tsx
"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      return
    }

    if (data.session) {
      // Session is automatically handled by middleware
      router.push("/dashboard")
    }
  }

  return (
    // ... form code ...
  )
}
```

### 5. Logout Workflow (Already Correct)

```tsx
"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/")
    router.refresh()
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  User Login at /                                 │
│  - Enters email & password                      │
│  - handleLogin() called                         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  supabase.auth.signInWithPassword()              │
│  - Browser client sends creds to Supabase      │
│  - Returns session with JWT token              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Middleware (middleware.ts)                      │
│  - updateSession() called on every request      │
│  - Refreshes session if expired                 │
│  - Updates session cookie                       │
│  - Redirects non-auth to /                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Dashboard Layout                                │
│  - Checks session exists                        │
│  - Validates superadmin role                    │
│  - Shows loading while checking                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  SessionProvider                                 │
│  - Gets session from supabase.auth              │
│  - Listens to auth state changes                │
│  - Provides useSession() hook                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Components                                      │
│  - Use useSession() hook                        │
│  - Access user data                             │
│  - Display user profile                         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Logout                                          │
│  - handleLogout() called                        │
│  - supabase.auth.signOut()                      │
│  - Redirect to /                                │
│  - router.refresh() clears session              │
└─────────────────────────────────────────────────┘
```

---

## Files Updated/Created

### Created Files
- ✅ `middleware.ts` - Session refresh & route protection
- ✅ `lib/hooks/useSession.ts` - Custom hook for session
- ✅ `components/providers/SessionProvider.tsx` - Session context

### Fixed Files
- ✅ `lib/supabase/client.ts` - Correct env variable
- ✅ `lib/supabase/proxy.ts` - Correct env variable
- ✅ `app/layout.tsx` - Enable SessionProvider
- ✅ `app/dashboard/layout.tsx` - Enable auth checks
- ✅ `components/app-sidebar.tsx` - Use real user data

---

## Environment Variables Required

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

NOT:
```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxx  # ❌ WRONG
```

---

## Security Best Practices

### ✅ DO

- Use `createClient()` from `@/lib/supabase/server` in Server Actions
- Use `createClient()` from `@/lib/supabase/client` in Client Components
- Always check session before showing protected content
- Validate user role for admin pages
- Use RLS policies in Supabase for data access
- Refresh session in middleware on every request

### ❌ DON'T

- Use browser client for server-side operations
- Hardcode user data in client components
- Skip session validation checks
- Expose sensitive operations to unauthenticated users
- Store sensitive info in cookies
- Make assumptions about user identity

---

## Testing the Auth Flow

### 1. Test Login
```bash
# Go to http://localhost:3000
# Enter test credentials
# Should redirect to /dashboard
```

### 2. Test Protected Route
```bash
# Open new incognito window
# Try to access http://localhost:3000/dashboard
# Should redirect back to /
```

### 3. Test Logout
```bash
# Click logout in sidebar
# Should redirect to /
# Session cleared
```

### 4. Test Session Persistence
```bash
# Login
# Close browser
# Reopen browser to /dashboard
# Should still be logged in (session in cookie)
```

---

## If You Update Fetch Functions

All fetch functions in `/server/fetch/` should follow this pattern:

```typescript
// ❌ WRONG - Don't use client
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

// ✅ RIGHT - Use server client
import { createClient } from "@/lib/supabase/server"

export const fetchData = async () => {
  const supabase = await createClient()
  // ...
}
```

---

## Common Issues & Fixes

### Issue: Users randomly logged out
**Cause**: Middleware not calling `getClaims()`
**Fix**: Ensure `middleware.ts` is properly configured

### Issue: Session not persisting
**Cause**: Cookies not being set properly
**Fix**: Check browser cookies for `sb-*` keys

### Issue: useSession returns null
**Cause**: Component not wrapped in SessionProvider
**Fix**: Ensure SessionProvider wraps the component tree

### Issue: Fetch failing in dashboard
**Cause**: Using browser client instead of server client
**Fix**: Update fetch functions to use `createClient` from `@/lib/supabase/server`

