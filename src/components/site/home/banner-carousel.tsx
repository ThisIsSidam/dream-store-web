"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RemoteImage } from "@/components/ui/remote-image";
import type { Banner } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4500;

function BannerSlide({ banner, priority }: { banner: Banner; priority: boolean }) {
  const content = (
    <>
      <RemoteImage
        src={banner.imageUrl}
        alt=""
        width={1600}
        priority={priority}
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex max-w-[75%] flex-col justify-center p-5 text-left sm:max-w-[55%] sm:p-10">
        <h3 className="font-display text-xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
          {banner.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/85 sm:text-base">{banner.description}</p>
      </div>
    </>
  );

  const className =
    "relative block h-44 w-full shrink-0 snap-center overflow-hidden bg-surface-container-high sm:h-64 lg:h-80";

  if (!banner.link) return <li className={className}>{content}</li>;

  const internal = banner.link.startsWith("/");
  return (
    <li className={className}>
      {internal ? (
        <Link href={banner.link} className="absolute inset-0">
          {content}
        </Link>
      ) : (
        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
          {content}
        </a>
      )}
    </li>
  );
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    const slide = track?.children[next] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  // Keep the dots in sync with whatever slide is centred.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        Array.from(track.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const distance = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
          if (distance < bestDistance) {
            best = i;
            bestDistance = distance;
          }
        });
        indexRef.current = best;
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => goTo((indexRef.current + 1) % banners.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, banners.length, goTo]);

  if (banners.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative mx-auto max-w-[1280px] overflow-hidden bg-white sm:mt-3 sm:shadow-soft"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
      >
        {banners.map((banner, i) => (
          <BannerSlide key={banner._id} banner={banner} priority={i === 0} />
        ))}
      </ul>

      {banners.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner._id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
              onClick={() => goTo((index + (dir === "prev" ? -1 : 1) + banners.length) % banners.length)}
              className={cn(
                "absolute top-1/2 hidden h-20 w-10 -translate-y-1/2 place-items-center bg-white/90 shadow-card hover:bg-white md:grid",
                dir === "prev" ? "left-0 rounded-r-sm" : "right-0 rounded-l-sm",
              )}
            >
              {dir === "prev" ? <ChevronLeft /> : <ChevronRight />}
            </button>
          ))}
        </>
      )}
    </section>
  );
}
