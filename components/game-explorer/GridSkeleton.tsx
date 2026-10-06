import { CARD_BODY_CLASS, CARD_CLASS, CARD_IMAGE_CLASS, GRID_CLASS, SKELETON_COUNT } from "./layout";

const SHIMMER = "skeleton-base relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] skeleton-shimmer motion-reduce:before:animate-none";

export function GridSkeleton() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری بازی‌ها">
      <div className="mb-7 space-y-5" aria-hidden="true">
        <div className="h-14 rounded-2xl skeleton-surface" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-10 w-28 rounded-xl skeleton-surface" />)}
        </div>
      </div>
      <ul className={GRID_CLASS} aria-hidden="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <li key={index} className={`${CARD_CLASS} skeleton-card`}>
            <div className={`${CARD_IMAGE_CLASS} ${SHIMMER}`} />
            <div className={CARD_BODY_CLASS}>
              <div className="space-y-2">
                <div className={`h-3 w-1/3 rounded ${SHIMMER}`} />
                <div className={`h-4 w-3/4 rounded ${SHIMMER}`} />
                <div className={`h-3 w-1/2 rounded ${SHIMMER}`} />
              </div>
              <div className={`h-3 w-full rounded ${SHIMMER}`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
