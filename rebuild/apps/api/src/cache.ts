import { LRUCache } from "lru-cache";
import { config } from "./config.js";

const cache = new LRUCache<string, object>({ max: config.CACHE_MAX_ENTRIES });
const inflight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit !== undefined) return hit as T;
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;
  const request = load().then((value) => {
    cache.set(key, value as object, { ttl });
    return value;
  }).finally(() => inflight.delete(key));
  inflight.set(key, request);
  return request;
}

export async function cachedDynamic<T>(key: string, load: () => Promise<{ value: T; ttl: number }>): Promise<T> {
  const hit = cache.get(key);
  if (hit !== undefined) return hit as T;
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;
  const request = load().then(({ value, ttl }) => {
    cache.set(key, value as object, { ttl });
    return value;
  }).finally(() => inflight.delete(key));
  inflight.set(key, request);
  return request;
}

export function clearEventScopedCache(eventId: number): void {
  for (const key of cache.keys()) {
    if (key.startsWith("event:") && !key.startsWith(`event:${eventId}:`)) cache.delete(key);
  }
}

export function clearCache(): void {
  cache.clear();
  inflight.clear();
}
