"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveImageUrl } from "@/lib/image";
import { CARD_IMAGE_CLASS } from "./layout";

type GameImageProps = {
  path: string;
  title: string;
  eager: boolean;
};

export function GameImage({ path, title, eager }: GameImageProps) {
  const src = resolveImageUrl(path);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={title}
        className={`${CARD_IMAGE_CLASS} flex items-center justify-center bg-zinc-200 text-4xl font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400`}
      >
        {(Array.from(title)[0] ?? "?").toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      key={src}
      src={src}
      alt={title}
      width={320}
      height={320}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      loading={eager ? "eager" : "lazy"}
      className={`${CARD_IMAGE_CLASS} object-cover`}
      onError={() => setFailedSrc(src)}
    />
  );
}
