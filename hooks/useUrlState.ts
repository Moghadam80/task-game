"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlState<T>(
  key: string,
  defaultValue: T,
): readonly [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const raw = searchParams.get(key);
    if (raw === null) return defaultValue;
    if (typeof defaultValue === "boolean") return (raw === "true" || raw === "1") as T;
    if (typeof defaultValue === "number") {
      const parsed = Number(raw);
      return (Number.isFinite(parsed) ? parsed : defaultValue) as T;
    }
    if (typeof defaultValue === "string") return raw as T;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }, [defaultValue, key, searchParams]);

  const setValue = useCallback(
    (nextValue: T) => {
      const params = new URLSearchParams(searchParams.toString());
      if (typeof nextValue === "string" && nextValue.trim() === "") {
        params.delete(key);
      } else {
        params.set(key, typeof nextValue === "string" ? nextValue : JSON.stringify(nextValue));
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [key, pathname, router, searchParams],
  );

  return [value, setValue] as const;
}
