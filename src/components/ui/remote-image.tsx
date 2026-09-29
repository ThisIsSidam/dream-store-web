import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn, optimizeImage } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  /** Requested width for Cloudinary transforms (defaults to a card-sized image). */
  width?: number;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
};

/**
 * Admin-entered image URLs can live on any host, so this uses `unoptimized`
 * (no next/image host allow-list) and lets Cloudinary do the resizing.
 * Fills its parent - give the wrapper a size.
 */
export function RemoteImage({
  src,
  alt,
  width = 800,
  className,
  imgClassName,
  fallback,
  priority,
  sizes,
}: Props) {
  const url = optimizeImage(src, width);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div className="grid size-full place-items-center text-outline">
          {fallback ?? <ImageOff className="size-8" aria-hidden />}
        </div>
      )}
    </div>
  );
}
