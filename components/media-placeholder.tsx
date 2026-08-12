import { ImageIcon, PlayCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  /** Real media URL — when provided, renders the actual media instead of the placeholder. */
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
  kind?: "image" | "video";
  aspect?: "video" | "square" | "portrait" | "wide";
  className?: string;
  label?: string;
};

const aspectClass: Record<NonNullable<MediaPlaceholderProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export function MediaPlaceholder({
  imageUrl,
  videoUrl,
  alt = "",
  kind = "image",
  aspect = "video",
  className,
  label,
}: MediaPlaceholderProps) {
  if (videoUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-md bg-surface", aspectClass[aspect], className)}>
        <video
          src={videoUrl}
          controls
          className="h-full w-full object-cover"
          aria-label={alt}
        />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-md bg-surface", aspectClass[aspect], className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  const Icon = kind === "video" ? PlayCircleIcon : ImageIcon;

  return (
    <div
      role="img"
      aria-label={alt || "Media coming soon"}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-surface text-textSecondary",
        aspectClass[aspect],
        className
      )}
    >
      <Icon className="size-8 opacity-60" strokeWidth={1.5} aria-hidden="true" />
      <span className="text-xs font-medium tracking-wide">
        {label ?? (kind === "video" ? "Video Coming Soon" : "Image Coming Soon")}
      </span>
    </div>
  );
}
