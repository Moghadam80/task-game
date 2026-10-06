"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "lifelands.favorite-game-ids";
const CHANGE_EVENT = "lifelands-favorites-change";

function parseFavorites(value: string): ReadonlySet<string> {
  try {
    const parsed: unknown = JSON.parse(value);
    return new Set(Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : []);
  } catch {
    return new Set();
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavorites() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favoriteIds = useMemo(() => parseFavorites(snapshot), [snapshot]);
  const toggleFavorite = useCallback((id: string) => {
    const next = new Set(parseFavorites(getSnapshot()));
    if (next.has(id)) next.delete(id); else next.add(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return { favoriteIds, toggleFavorite };
}
