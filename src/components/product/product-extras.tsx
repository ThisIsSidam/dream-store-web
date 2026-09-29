import { Mountain, Star } from "lucide-react";

/** The editorial "bento" panel and review shown under every product. */
export function ProductExtras() {
  return (
    <>
      <section className="px-6 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-secondary-container p-8 md:col-span-2 md:p-10">
            <h2 className="t-headline-md text-on-secondary-container">Capture the Intangible</h2>
            <p className="t-body-md mt-4 text-on-secondary-container/80">
              Our specialized vacuum-spheres are deployed only during solar eclipses to ensure maximum
              existential density. Every bottle is hand-labelled by someone who once saw a mountain from
              a distance.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-tertiary-container p-8 text-center md:p-10">
            <Mountain className="size-12 text-on-tertiary-container" aria-hidden />
            <h2 className="t-headline-md mt-4 text-on-tertiary-container">Peak Purity</h2>
            <p className="t-body-md mt-2 text-on-tertiary-container/80">
              99.9% Argon-free for that extra crisp inhale.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <h2 className="t-headline-lg">Truth from Seekers</h2>
            <div className="hidden h-1 flex-1 rounded-full bg-outline-variant sm:block" aria-hidden />
          </div>
          <figure className="mt-8 rounded-3xl bg-surface-container-highest/40 p-6 sm:p-10">
            <div className="flex" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-6 fill-tertiary text-tertiary" aria-hidden />
              ))}
            </div>
            <blockquote className="mt-6 font-display text-xl font-bold leading-snug sm:text-2xl">
              “Mmm. Tastes like the color blue and expensive mistakes. Highly recommended for buyers who
              prefer their air with lore.”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-full border-2 border-primary bg-primary-container/30 font-display text-2xl font-extrabold text-primary">
                L
              </span>
              <span>
                <span className="t-body-lg block font-bold">A Literate Buyer</span>
                <span className="t-body-md text-on-surface-variant">Verified High-Altitude Critic</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
