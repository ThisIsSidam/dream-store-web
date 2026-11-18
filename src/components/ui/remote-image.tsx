import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
};

/**
 * Admin-entered image URLs can live on any host, so this uses `unoptimized`
 * (no next/image host allow-list).
 * Fills its parent - give the wrapper a size.
 */
export function RemoteImage({
  src,
  alt,
  className,
  imgClassName,
  fallback,
  priority,
  sizes,
}: Props) {
  const url = src || null;

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
