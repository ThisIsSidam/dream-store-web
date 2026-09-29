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
        width={1200}
        priority={priority}
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 40vw"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-8">
        <h3 className="t-headline-lg !text-[clamp(1.5rem,3vw,3rem)] text-white">{banner.title}</h3>
        <p className="t-body-md mt-2 line-clamp-2 text-white/80">{banner.description}</p>
      </div>
    </>
  );

  const className =
    "relative block h-60 w-[85vw] shrink-0 snap-center overflow-hidden rounded-3xl bg-surface-container-highest shadow-[0_10px_20px_rgb(0_0_0/0.05)] sm:h-70 sm:w-[60vw] lg:h-80 lg:w-[40vw]";

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
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: "smooth",
    });
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
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-[7.5vw] py-3 sm:px-[20vw] lg:px-[30vw]"
      >
        {banners.map((banner, i) => (
          <BannerSlide key={banner._id} banner={banner} priority={i === 0} />
        ))}
      </ul>

      {banners.length > 1 && (
        <>
          <div className="mt-3 flex items-center justify-center gap-2">
            {banners.map((banner, i) => (
              <button
                key={banner._id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-primary" : "w-2 bg-outline-variant",
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
                "absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow-card backdrop-blur hover:bg-surface lg:grid",
                dir === "prev" ? "left-[2vw]" : "right-[2vw]",
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
