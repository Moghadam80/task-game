"use client";

type FavoriteToggleProps = {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
};

export function FavoriteToggle({ checked, onChange }: FavoriteToggleProps) {
  return (
    <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition focus-within:ring-2 focus-within:ring-blue-500 ${checked ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300" : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span aria-hidden="true" className="text-base leading-none">{checked ? "★" : "☆"}</span>
      علاقه‌مندی‌ها
    </label>
  );
}
