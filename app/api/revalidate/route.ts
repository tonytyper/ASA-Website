import { createHash, timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"

import { GALLERY_CACHE_TAG } from "@/lib/supabase"

/**
 * Drops the cached gallery so newly ingested photos appear on the next visit
 * instead of up to an hour later. Called by `npm run gallery:ingest` once it
 * has published, authenticated with a shared secret.
 *
 * POST only: a GET endpoint could be fired by a link preview, a crawler, or a
 * prefetch, and Next answers every other method with 405 on its own.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET

  // Refuse outright when unconfigured. Comparing against a missing secret
  // would otherwise let an empty Authorization header through.
  if (!secret) {
    return Response.json({ revalidated: false, error: "REVALIDATE_SECRET is not set" }, { status: 500 })
  }

  // The secret travels in a header rather than the query string, which would
  // land in access logs.
  const header = request.headers.get("authorization") ?? ""
  const provided = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : ""

  if (!matches(provided, secret)) {
    return Response.json({ revalidated: false, error: "Unauthorized" }, { status: 401 })
  }

  // `expire: 0` makes the next request fetch fresh rather than serving the old
  // gallery one more time while revalidating in the background, which is what
  // the recommended "max" profile does. The one-argument form that used to do
  // this is deprecated in Next 16.
  revalidateTag(GALLERY_CACHE_TAG, { expire: 0 })

  return Response.json({ revalidated: true, tag: GALLERY_CACHE_TAG, now: Date.now() })
}

/**
 * Constant-time comparison, so response timing cannot reveal how many leading
 * characters of a guess were right. timingSafeEqual requires equal lengths, so
 * both sides are hashed to a fixed 32 bytes first; that also avoids leaking
 * the secret's length.
 */
function matches(provided: string, secret: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest()
  return timingSafeEqual(digest(provided), digest(secret))
}
