"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroll-snap rail with arrows on desktop (hidden when there's nothing to scroll). */
export function ProductRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const update = () =>
      setEdge({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollBy = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow =
    "absolute top-1/2 z-10 hidden h-20 w-9 -translate-y-1/2 place-items-center bg-white shadow-float hover:bg-surface md:grid";

  return (
    <div className="relative">
      <ul ref={ref} className="scrollbar-none flex snap-x overflow-x-auto">
        {children}
      </ul>
      {!edge.start && (
        <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className={`${arrow} left-0 rounded-r-sm`}>
          <ChevronLeft className="size-6" />
        </button>
      )}
      {!edge.end && (
        <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className={`${arrow} right-0 rounded-l-sm`}>
          <ChevronRight className="size-6" />
        </button>
      )}
    </div>
  );
}
