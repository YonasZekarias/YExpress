/**
 * API base URL for browser requests. Trailing slashes are removed.
 */
export function getApiUrlOrNull(): string | null {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!u) return null;
  return u.replace(/\/$/, "");
}

export function getApiUrl(): string {
  const base = getApiUrlOrNull();
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return base;
}
