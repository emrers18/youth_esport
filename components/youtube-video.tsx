"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Unlisted YouTube upload of the BRIDGE project introduction video. */
export const PROJECT_VIDEO_ID = "FnibvFbtWPA";

/**
 * Lightweight YouTube embed: shows only the thumbnail and a play button until
 * clicked, so the ~1MB YouTube player (and its cookies) never loads for
 * visitors who don't watch the video.
 */
export function YouTubeVideo({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // Not every upload has a maxres thumbnail; hqdefault always exists.
  const [thumbnail, setThumbnail] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  );

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-md bg-surface", className)}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
          />
          <span className="absolute inset-0 bg-background/30 transition-colors group-hover:bg-background/10" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-110">
            <PlayIcon className="size-7 translate-x-0.5 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
