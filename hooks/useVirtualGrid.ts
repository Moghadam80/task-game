"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";

type VirtualGridOptions = {
  readonly count: number;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly rowHeight?: number | ((containerWidth: number, columns: number) => number);
  readonly gap?: number;
  readonly overscan?: number;
};

type VirtualGridResult = {
  readonly columns: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly top: number;
  readonly bottom: number;
  readonly enabled: boolean;
};

function getColumns(width: number): number {
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

export function useVirtualGrid({
  count,
  containerRef,
  rowHeight = 400,
  gap = 16,
  overscan = 2,
}: VirtualGridOptions): VirtualGridResult {
  const [viewport, setViewport] = useState({ width: 0, height: 800, scrollY: 0, documentTop: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        setViewport({
          width: rect.width,
          height: window.innerHeight,
          scrollY: window.scrollY,
          documentTop: rect.top + window.scrollY,
        });
      });
    };

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  return useMemo(() => {
    const columns = getColumns(viewport.width);
    const resolvedRowHeight = typeof rowHeight === "function" ? rowHeight(viewport.width, columns) : rowHeight;
    const enabled = count > 50;
    const rows = Math.ceil(count / columns);
    if (!enabled || rows === 0) {
      return { columns, startIndex: 0, endIndex: count, top: 0, bottom: 0, enabled: false };
    }

    const relativeScroll = Math.max(0, viewport.scrollY - viewport.documentTop);
    const visibleStartRow = Math.max(0, Math.floor(relativeScroll / (resolvedRowHeight + gap)) - overscan);
    const visibleEndRow = Math.min(
      rows,
      Math.ceil((relativeScroll + viewport.height) / (resolvedRowHeight + gap)) + overscan,
    );
    const startIndex = visibleStartRow * columns;
    const endIndex = Math.min(count, visibleEndRow * columns);
    const top = visibleStartRow * (resolvedRowHeight + gap);
    const bottom = Math.max(0, (rows - visibleEndRow) * (resolvedRowHeight + gap));

    return { columns, startIndex, endIndex, top, bottom, enabled: true };
  }, [count, gap, overscan, rowHeight, viewport]);
}
