"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FilterDefinition } from "@/lib/filters.config";

type FilterPopoverProps = {
  readonly definition: FilterDefinition;
  readonly options: readonly string[];
  readonly selected: readonly string[];
  readonly onApply: (values: string[]) => void;
};

export function displayFilterValue(definition: FilterDefinition, value: string): string {
  if (definition.kind === "min") return `حداقل ${value}`;
  return definition.labelFor(value);
}

export function FilterPopover({ definition, options, selected, onApply }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([...selected]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const visibleOptions = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase("fa");
    if (!normalized) return options;
    return options.filter((option) => displayFilterValue(definition, option).toLocaleLowerCase("fa").includes(normalized));
  }, [definition, options, search]);

  const toggle = (value: string) => {
    if (definition.kind === "min") {
      setDraft((current) => (current.includes(value) ? [] : [value]));
      return;
    }
    setDraft((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const clear = () => setDraft([]);
  const apply = () => {
    onApply(draft);
    setOpen(false);
  };

  const count = selected.length;
  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => {
          setDraft([...selected]);
          setSearch("");
          setOpen((current) => !current);
        }}
        className={`group inline-flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${count > 0 ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300" : "border-zinc-200 bg-white text-zinc-700  dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"}`}
      >
        <span>{definition.label}</span>
        {count > 0 ? <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white">{count}</span> : null}
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 7.5 5 5 5-5" /></svg>
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-label={`فیلتر ${definition.label}`} className="absolute right-0 top-[calc(100%+8px)] z-30 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30">
          <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{definition.label}</h3>
                <p className="mt-0.5 text-xs text-zinc-500">{count ? `${count.toLocaleString("fa-IR")} انتخاب شده` : "انتخاب کنید"}</p>
              </div>
              {count ? <button type="button" onClick={clear} className="text-xs font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">پاک کردن</button> : null}
            </div>
            {options.length > 7 ? (
              <label className="relative mt-3 block">
                <span className="sr-only">جست‌وجوی گزینه‌های {definition.label}</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی گزینه..." className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900" />
              </label>
            ) : null}
          </div>

          <div className="max-h-64 overflow-y-auto p-2" role={definition.kind === "min" ? "radiogroup" : undefined}>
            {visibleOptions.length === 0 ? <p className="px-3 py-6 text-center text-xs text-zinc-500">گزینه‌ای پیدا نشد.</p> : visibleOptions.map((option) => {
              const checked = draft.includes(option);
              return (
                <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors  has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:hover:bg-zinc-900">
                  <input type={definition.kind === "min" ? "radio" : "checkbox"} name={definition.kind === "min" ? `${panelId}-min` : undefined} checked={checked} onChange={() => toggle(option)} className="peer sr-only" />
                  <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${checked ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"}`}>
                    {checked ? (definition.kind === "min" ? <span className="size-2 rounded-full bg-white" /> : <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 8 3 3 7-7" /></svg>) : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{displayFilterValue(definition, option)}</span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-300 dark:hover:bg-zinc-800">انصراف</button>
            <button type="button" onClick={apply} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">اعمال فیلتر</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

