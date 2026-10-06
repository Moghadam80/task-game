"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SORT_OPTIONS, type SortOption } from "@/lib/sort";

const SORT_LABELS: Record<SortOption, string> = {
  quality: "پیشنهاد شده",
  score: "بیشترین امتیاز",
  runCount: "بیشترین اجرا",
  seenCount: "بیشترین بازدید",
  like: "بیشترین پسند",
};

type SortMenuProps = {
  readonly value: SortOption;
  readonly onChange: (value: SortOption) => void;
};

export function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="listbox" aria-controls={menuId} onClick={() => setOpen((current) => !current)} className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl sm:min-h-10 sm:w-auto border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-400">مرتب‌سازی</span>
        <span>{SORT_LABELS[value]}</span>
        </div>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 7.5 5 5 5-5" /></svg>
      </button>
      {open ? (
        <div id={menuId} role="listbox" aria-label="مرتب‌سازی بازی‌ها" className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-52 sm:left-0 sm:right-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950">
          {SORT_OPTIONS.map((option) => {
            const selected = option === value;
            return <button key={option} type="button" role="option" aria-selected={selected} onClick={() => { onChange(option); setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${selected ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "text-zinc-700  dark:text-zinc-200 dark:hover:bg-zinc-900"}`}>
              <span>{SORT_LABELS[option]}</span>
              {selected ? <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 8 3 3 7-7" /></svg> : null}
            </button>;
          })}
        </div>
      ) : null}
    </div>
  );
}

