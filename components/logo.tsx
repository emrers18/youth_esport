import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The logo artwork has white/light-colored elements, so it needs a dark
 * chip behind it to stay legible against the site's light background.
 */
export function Logo({
  className,
  imageClassName,
  priority,
}: {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-textPrimary p-1 ring-1 ring-gold/30",
        className
      )}
    >
      <Image
        src="/gallery/logo.png"
        alt="YouthEsportsArena logo"
        width={1080}
        height={1080}
        priority={priority}
        className={cn("size-full object-contain", imageClassName)}
      />
    </span>
  );
}
