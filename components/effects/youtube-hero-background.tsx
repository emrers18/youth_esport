export function YoutubeHeroBackground({
  videoId,
  className,
}: {
  videoId: string;
  className?: string;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&playsinline=1`;

  return (
    <div
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full overflow-hidden"}
    >
      <iframe
        src={src}
        title="Arka plan tanıtım videosu"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
