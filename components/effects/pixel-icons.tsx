import { cn } from "@/lib/utils";

type PixelIconProps = {
  className?: string;
};

/**
 * Blocky, 8-bit-inspired decorative sprites for empty states and section
 * accents — a small nod to game UI without pulling in real image assets.
 */

export function PixelTrophy({ className }: PixelIconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={cn("size-12", className)} aria-hidden="true">
      <g fill="currentColor">
        <rect x="5" y="1" width="6" height="1" />
        <rect x="4" y="2" width="1" height="1" />
        <rect x="11" y="2" width="1" height="1" />
        <rect x="5" y="2" width="6" height="4" opacity="0.85" />
        <rect x="2" y="2" width="2" height="1" />
        <rect x="12" y="2" width="2" height="1" />
        <rect x="2" y="3" width="1" height="2" />
        <rect x="13" y="3" width="1" height="2" />
        <rect x="3" y="4" width="1" height="1" opacity="0.6" />
        <rect x="12" y="4" width="1" height="1" opacity="0.6" />
        <rect x="6" y="6" width="4" height="2" opacity="0.85" />
        <rect x="7" y="8" width="2" height="2" />
        <rect x="5" y="10" width="6" height="1" />
        <rect x="4" y="11" width="8" height="2" />
      </g>
    </svg>
  );
}

export function PixelJoystick({ className }: PixelIconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={cn("size-12", className)} aria-hidden="true">
      <g fill="currentColor">
        <rect x="7" y="1" width="2" height="1" />
        <rect x="6" y="2" width="4" height="3" opacity="0.85" />
        <rect x="7" y="5" width="2" height="4" />
        <rect x="2" y="9" width="12" height="2" opacity="0.85" />
        <rect x="3" y="11" width="2" height="2" />
        <rect x="6" y="11" width="1" height="2" />
        <rect x="9" y="11" width="1" height="2" />
        <rect x="11" y="11" width="2" height="2" />
      </g>
    </svg>
  );
}

export function PixelShield({ className }: PixelIconProps) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={cn("size-12", className)} aria-hidden="true">
      <g fill="currentColor">
        <rect x="4" y="2" width="8" height="1" />
        <rect x="3" y="3" width="10" height="3" opacity="0.85" />
        <rect x="3" y="6" width="10" height="3" opacity="0.7" />
        <rect x="4" y="9" width="8" height="2" opacity="0.55" />
        <rect x="5" y="11" width="6" height="2" opacity="0.4" />
        <rect x="7" y="13" width="2" height="1" opacity="0.3" />
      </g>
    </svg>
  );
}
