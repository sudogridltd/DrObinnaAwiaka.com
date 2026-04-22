/**
 * Fire-and-forget POST to the frontend's /_sitemap/regenerate endpoint.
 * Non-fatal: if the frontend is unreachable the sitemap self-heals when
 * its 1-hour in-memory cache expires.
 */
export async function notifySitemapRegenerate(source: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${frontendUrl}/_sitemap/regenerate`, {
      method: 'POST',
      signal: AbortSignal.timeout(5_000),
    });
    if (res.ok) {
      console.log(`[sitemap] cache invalidated — triggered by ${source}`);
    } else {
      console.warn(`[sitemap] regenerate returned ${res.status} — ${source}`);
    }
  } catch {
    console.warn(`[sitemap] could not reach frontend to invalidate cache (${source})`);
  }
}
