"use client";

import { useStore } from "@/lib/client/store";
import { Bell, Eye, Lock, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function MysteryDrop() {
  const {
    isMysteryRevealed,
    revealMysteryDrop,
    subscribeMysteryNotification,
    addToCart,
  } = useStore();
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 27,
    seconds: 43,
  });

  // Live countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address for temporal alerts.");
      return;
    }
    subscribeMysteryNotification(email);
    setEmail("");
  }

  function handleAddRevealedToCart() {
    // Add mock revealed product
    addToCart({
      id: "anomaly-drop-88",
      _id: "yc_drop_088",
      name: "Anti-Gravity Ceramic Vessel",
      slug: "anti-gravity-vessel",
      category: "Science",
      shortDescription:
        "Ceramic vessel that hovers precisely 4mm above tabletops when filled with hot liquid.",
      description:
        "Anomaly Drop #88. Engineered using localized diamagnetic levitation.",
      price: 449,
      minPrice: 449,
      maxPrice: 449,
      totalStock: 14,
      rating: 5.0,
      reviewCount: 1,
      badge: "Limited",
      oddness: "We Should Probably Investigate",
      sku: "YC-ANOM-088",
      visualId: "bottled-echoes",
      specifications: {
        "Levitation Height": "4.2mm",
        Material: "Superconducting porcelain",
      },
      whatsIncluded: ["1 × Vessel", "1 × Thermal base"],
      frequentlyBoughtTogether: [],
      variants: [
        {
          id: "var_drop_88",
          name: "Glazed Obsidian",
          price: 449,
          stock: 14,
          sku: "YC-ANOM-088",
        },
      ],
      reviews: [],
      images: [],
    });
  }

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-16 text-white sm:py-20">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(79,70,229,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-[1360px] px-4">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Mystery Event Details */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="size-3.5 text-indigo-400" />
              <span>Sanctioned Anomaly Event #88</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-4xl sm:text-6xl font-black tracking-widest text-indigo-400">
                {isMysteryRevealed ? "REVEALED" : "???"}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                Classified Manifestation
              </span>
            </div>

            <h2 className="mt-2 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Something has arrived.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              {isMysteryRevealed
                ? "The shroud has lifted. Anomaly Drop #88: Anti-Gravity Ceramic Vessel. Employs localized diamagnetic repulsion to float effortlessly above hard surfaces."
                : "A limited product whose identity is intentionally obscured. Arrived unannounced at our logistics depot at 03:14 AM. Testing protocols confirm it operates within acceptable physical boundaries."}
            </p>

            {/* Live Countdown & Scarcity metrics */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-neutral-800 py-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1.5">
                  <Timer className="size-3.5 text-indigo-400" />
                  <span>Drop Expires In</span>
                </p>
                <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-bold text-white">
                  <div className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </div>
                  <span>:</span>
                  <div className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </div>
                  <span>:</span>
                  <div className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-indigo-400">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-neutral-800 hidden sm:block" />

              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  Availability
                </p>
                <p className="text-xl sm:text-2xl font-bold text-amber-400">
                  14 units remaining
                </p>
              </div>

              <div className="h-10 w-px bg-neutral-800 hidden sm:block" />

              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  Drop Price
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  $449.00
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {!isMysteryRevealed ? (
                <button
                  type="button"
                  onClick={revealMysteryDrop}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 shadow-md active:scale-95"
                >
                  <Eye className="size-4" />
                  <span>Reveal Product</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddRevealedToCart}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 shadow-md active:scale-95"
                >
                  <ShieldCheck className="size-4" />
                  <span>Add Anomaly to Cart ($449)</span>
                </button>
              )}

              {/* Notify Me Form */}
              <form onSubmit={handleNotify} className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for drop alert..."
                    className="h-11 w-52 sm:w-64 rounded-md border border-neutral-700 bg-neutral-900/90 px-3 text-xs text-white placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-900 px-4 text-xs font-semibold text-neutral-200 transition-colors hover:bg-neutral-800"
                >
                  <Bell className="size-3.5 text-indigo-400" />
                  <span>Notify Me</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Mystery Product Silhouette */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md">
              {/* Radial pulsing glow */}
              <div className="absolute inset-8 rounded-full bg-indigo-600/20 blur-2xl animate-pulse pointer-events-none" />

              {isMysteryRevealed ? (
                <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  {/* Revealed Vessel Icon / Graphic */}
                  <div className="relative size-36 rounded-full border-2 border-indigo-400/80 bg-neutral-950 flex items-center justify-center shadow-indigo-500/30 shadow-lg">
                    <svg
                      viewBox="0 0 100 100"
                      className="size-24 text-indigo-400"
                      fill="none"
                    >
                      <path
                        d="M30 35 L70 35 L65 75 L35 75 Z"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                      <ellipse
                        cx="50"
                        cy="35"
                        rx="20"
                        ry="6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="25"
                        y1="85"
                        x2="75"
                        y2="85"
                        stroke="#6366f1"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                      {/* Floating waves */}
                      <path
                        d="M40 80 Q 50 78 60 80"
                        stroke="#a5b4fc"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-bold text-white">
                    Anti-Gravity Ceramic Vessel
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    4.2mm Diamagnetic Hover Field
                  </p>
                  <span className="mt-2 text-xs font-bold text-emerald-400">
                    Status: Unlocked for purchase
                  </span>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  {/* Silhouette Graphic with Question Mark */}
                  <div className="relative size-36 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    <Lock className="size-10 text-neutral-600" />
                    <div className="absolute inset-0 rounded-full border border-indigo-500/40 animate-ping opacity-25" />
                  </div>
                  <span className="mt-6 font-mono text-3xl font-black text-neutral-500">
                    CLASSIFIED
                  </span>
                  <p className="mt-2 text-xs text-neutral-400 max-w-xs">
                    Dimensions and spectral frequency encrypted until release.
                  </p>
                </div>
              )}

              <div className="absolute bottom-3 text-[10px] font-mono text-neutral-500">
                SECURITY CLEARANCE: PUBLIC / QUESTIONABLE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
