const MAX_PAGE = 10_000;

export function parsePageParam(raw: string | null): number | null {
  if (raw === null) return 1;
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  return page >= 1 && page <= MAX_PAGE ? page : null;
}
