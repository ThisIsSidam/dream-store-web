"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A JSON value kept in localStorage, read through useSyncExternalStore so it
 * is SSR-safe (the server and the first client render both see `fallback`,
 * then the stored value arrives without a hydration mismatch) and stays in
 * sync across components and tabs.
 *
 * `fallback` must be a stable reference (a module-level constant).
 * Storage can be unavailable (private mode, blocked cookies); the value then
 * lives in memory for the session and nothing throws.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The last parsed value per key, so an unchanged string yields the same object. */
const parsed = new Map<string, { raw: string | null; value: unknown }>();

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // storage blocked: fall through to whatever is cached in memory
  }
  const cached = parsed.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      // corrupt value: behave as if nothing was stored
    }
  }
  parsed.set(key, { raw, value });
  return value;
}

function write<T>(key: string, value: T) {
  let raw: string | null = null;
  try {
    raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
  } catch {
    raw = null; // keep it in memory only
  }
  const cached = parsed.get(key);
  // Same serialisation as before: nothing changed, so don't wake subscribers.
  if (raw !== null && cached?.raw === raw) return;
  parsed.set(key, { raw, value });
  listeners.forEach((listener) => listener());
}

export function useLocalStorage<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );

  const set = useCallback(
    (next: T | ((previous: T) => T)) => {
      const previous = read(key, fallback);
      write(key, typeof next === "function" ? (next as (p: T) => T)(previous) : next);
    },
    [key, fallback],
  );

  return [value, set] as const;
}
