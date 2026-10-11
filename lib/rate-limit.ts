const store = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: Date } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (store.get(key) ?? []).filter((t) => t > windowStart);
  timestamps.push(now);
  store.set(key, timestamps);
  const remaining = Math.max(0, limit - timestamps.length);
  const resetAt = new Date(now + windowMs);
  return { allowed: timestamps.length <= limit, remaining, resetAt };
}
