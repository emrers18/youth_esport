"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Self-hosted looping background video — no iframe, no third-party player
 * script. Only starts decoding once it's actually on screen and the tab is
 * active, and stays paused for prefers-reduced-motion, so the loop never
 * burns CPU/battery when nobody can see it.
 */
export function VideoBackground({
  src,
  className,
  videoClassName,
}: {
  src: string;
  className?: string;
  videoClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => void video.play().catch(() => {});
    const pause = () => video.pause();

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0.1 }
    );
    observer.observe(video);

    const onVisibilityChange = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibilityChange);

    play();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full overflow-hidden"}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className={cn("pointer-events-none h-full w-full object-cover", videoClassName)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
