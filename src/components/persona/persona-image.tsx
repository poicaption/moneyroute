import Image from "next/image";
import type { MoneyTypeKey } from "@/lib/domain/money-types";
import type { IdentityKey } from "@/lib/domain/identities";
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

/** Dedicated art for each of the sixteen identities. */
export const IDENTITY_IMAGES: Record<IdentityKey, string> = {
  closer: "/personas/identities/closer.png",
  rainmaker: "/personas/identities/rainmaker.png",
  connector: "/personas/identities/connector.png",
  storyteller: "/personas/identities/storyteller.png",
  magnetizer: "/personas/identities/magnetizer.png",
  educator: "/personas/identities/educator.png",
  specialist: "/personas/identities/specialist.png",
  advisor: "/personas/identities/advisor.png",
  mentor: "/personas/identities/mentor.png",
  systemizer: "/personas/identities/systemizer.png",
  executor: "/personas/identities/executor.png",
  orchestrator: "/personas/identities/orchestrator.png",
  trader: "/personas/identities/trader.png",
  curator: "/personas/identities/curator.png",
  architect: "/personas/identities/architect.png",
  visionary: "/personas/identities/visionary.png",
};

const SIZES = {
  sm: 72,
  md: 120,
  lg: 200,
  xl: 300,
} as const;

type PersonaSize = keyof typeof SIZES;

/**
 * The source PNGs include transparent padding around each character, which
 * makes neighbouring art look further apart than it is. `zoom` scales the art
 * inside its box (via a wrapper so it composes with the float animation) to
 * visually trim that padding. Defaults to a gentle 1.12.
 */
function FloatingArt({
  src,
  alt,
  size = "md",
  zoom = 1.12,
  className,
  priority = false,
  float = true,
  ground = true,
}: {
  src: string;
  alt: string;
  size?: PersonaSize;
  zoom?: number;
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
      <div
        className="relative z-10 h-full w-full"
        style={{ transform: `scale(${zoom})` }}
      >
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          priority={priority}
          className={cn(
            "h-full w-full object-contain",
            float && "persona-float",
          )}
          sizes={`${px}px`}
        />
      </div>
      {ground ? (
        <div
          aria-hidden
          className="persona-ground pointer-events-none absolute inset-x-[12%] bottom-[2%] z-0 h-[10%] rounded-[50%]"
        />
      ) : null}
    </div>
  );
}

/**
 * Renders the persona voxel artwork as a floating 3D element. The source PNGs
 * are transparent, so we drop the art straight onto the page with a cast
 * shadow (and an optional ground shadow) for a layered, 3D look — no frame.
 */
export default function PersonaImage({
  type,
  size = "md",
  zoom,
  className,
  priority = false,
  float = true,
  ground = true,
}: {
  type: MoneyTypeKey;
  size?: PersonaSize;
  zoom?: number;
  className?: string;
  priority?: boolean;
  float?: boolean;
  ground?: boolean;
}) {
  return (
    <FloatingArt
      src={PERSONA_IMAGES[type]}
      alt={`ตัวละคร ${type}`}
      size={size}
      zoom={zoom}
      className={className}
      priority={priority}
      float={float}
      ground={ground}
    />
  );
}

/**
 * Renders one of the sixteen identity artworks. Falls back to the base-type
 * persona art if a dedicated identity image is unavailable, so pages never
 * break while artwork is being added.
 */
export function IdentityImage({
  slug,
  baseType,
  size = "md",
  zoom,
  className,
  priority = false,
  float = true,
  ground = true,
}: {
  slug: string;
  baseType: MoneyTypeKey;
  size?: PersonaSize;
  zoom?: number;
  className?: string;
  priority?: boolean;
  float?: boolean;
  ground?: boolean;
}) {
  const src =
    IDENTITY_IMAGES[slug as IdentityKey] ?? PERSONA_IMAGES[baseType];
  return (
    <FloatingArt
      src={src}
      alt={`อัตลักษณ์ ${slug}`}
      size={size}
      zoom={zoom}
      className={className}
      priority={priority}
      float={float}
      ground={ground}
    />
  );
}
