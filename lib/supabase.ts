import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cache tag for every gallery read. An ingest run can call
 * `revalidateTag(GALLERY_CACHE_TAG)` to publish new photos immediately instead
 * of waiting out the window below.
 */
export const GALLERY_CACHE_TAG = "gallery"

// Photos land a handful of times a semester, so an hour of staleness is
// invisible to visitors and keeps the homepage a prerendered document served
// from the CDN rather than a per-request round trip to Postgres.
const REVALIDATE_SECONDS = 3600

// supabase-js issues its own fetch calls, so wrapping the client's fetch is the
// only place Next's cache directives can be attached to them.
const cachedFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    next: { revalidate: REVALIDATE_SECONDS, tags: [GALLERY_CACHE_TAG] },
  })

// `undefined` means "not resolved yet"; `null` means "resolved, not configured".
let cached: SupabaseClient | null | undefined

/**
 * The site's read-only Supabase client, or `null` when the project is not
 * configured. Returning null rather than throwing keeps a fresh clone with no
 * `.env.local` buildable — the gallery just renders its empty state.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are unset — " +
        "the gallery will render empty. See .env.example.",
    )
    cached = null
    return cached
  }

  // The publishable key is designed to ship to browsers: row level security,
  // not key secrecy, is what keeps the data safe.
  cached = createClient(url, publishableKey, {
    auth: {
      // Nothing here ever signs in, so skip the session storage and refresh
      // timers the auth client would otherwise set up on every server render.
      persistSession: false,
      autoRefreshToken: false,
      skipAutoInitialize: true,
    },
    global: { fetch: cachedFetch },
  })

  return cached
}
