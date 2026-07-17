import Image from "next/image";
import type { MoneyTypeKey } from "@/lib/domain/money-types";
import { cn } from "@/lib/utils";

/** Voxel persona art for each money type, stored in public/personas. */
export const PERSONA_IMAGES: Record<MoneyTypeKey, string> = {
  hunter: "/personas/hunter.png",
  creator: "/personas/creator.png",
  expert: "/personas/expert.png",
  operator: "/personas/operator.png",
  merchant: "/personas/merchant.png",
  builder: "/personas/builder.png",
};

const SIZES = {
  sm: 72,
  md: 120,
  lg: 200,
  xl: 300,
} as const;

type PersonaSize = keyof typeof SIZES;

/**
 * Renders the persona voxel artwork as a floating 3D element. The source PNGs
 * are transparent, so we drop the art straight onto the page with a cast
 * shadow (and an optional ground shadow) for a layered, 3D look — no frame.
 */
export default function PersonaImage({
  type,
  size = "md",
  className,
  priority = false,
  float = true,
  ground = true,
}: {
  type: MoneyTypeKey;
  size?: PersonaSize;
  className?: string;
  priority?: boolean;
  float?: boolean;
  ground?: boolean;
}) {
  const px = SIZES[size];
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src={PERSONA_IMAGES[type]}
        alt={`ตัวละคร ${type}`}
        width={px}
        height={px}
        priority={priority}
        className={cn(
          "relative z-10 h-full w-full object-contain",
          float && "persona-float",
        )}
        sizes={`${px}px`}
      />
      {ground ? (
        <div
          aria-hidden
          className="persona-ground pointer-events-none absolute inset-x-[12%] bottom-[2%] z-0 h-[10%] rounded-[50%]"
        />
      ) : null}
    </div>
  );
}
