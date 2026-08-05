type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const store = new Map<string, CacheEntry<unknown>>();

export async function withCache<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.value as T;
  }

  const value = await loader();
  store.set(key, { expiresAt: Date.now() + ttlMs, value });
  return value;
}

export const TTL = {
  quote: 5_000,
  indices: 5_000,
  chart: 60_000,
  profile: 60 * 60_000,
  search: 60_000,
  news: 5 * 60_000,
} as const;
