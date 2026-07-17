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
  sm: 64,
  md: 96,
  lg: 160,
  xl: 224,
} as const;

type PersonaSize = keyof typeof SIZES;

/**
 * Renders the persona artwork as a gold-ringed badge. The source art sits on a
 * white field, so we crop to a circle and top-align to frame the character.
 */
export default function PersonaImage({
  type,
  size = "md",
  className,
  priority = false,
}: {
  type: MoneyTypeKey;
  size?: PersonaSize;
  className?: string;
  priority?: boolean;
}) {
  const px = SIZES[size];
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-gold/70 shadow-[0_0_28px_rgba(212,175,55,0.25)]",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={PERSONA_IMAGES[type]}
        alt={`ตัวละคร ${type}`}
        width={px}
        height={px}
        priority={priority}
        className="h-full w-full scale-110 object-cover object-top"
        sizes={`${px}px`}
      />
    </div>
  );
}
