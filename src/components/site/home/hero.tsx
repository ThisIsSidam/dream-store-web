import { LinkButton } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";

const EVEREST_AIR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBtIzKCaPiRLiZh3eNawGNQzmpDj0SqyYtcc8UOlMC5dyhgnSjSDaf6gHUXiVtgKqfQToYuOprk6rrhcotz6jPuB6hb08nrWiMiKIy7icpMqrwTSB3KtENNwVSxKbZ4x0oIlRUQ2VcFzqliBOufBYlcU0-KeeCrZ7HbpM1ngqjLgkfqdE5ltsKArh1aqiqtAAzg2gQ1m2bbc7alFlw0FW8lti-OcSpC6po4XbtbTXnywbVB5p3VZZc_Q47w3Hy6m36fSRV_SaSOEq4";
const JAN_FIRST =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBU8YhGb4PcYwgfL7XYG6gbXKxX1t9kyVx4Tzg-Y11pYsX9MDSefYnulFzQ2aaJsS0W4ue5VqGmTz11yLTD24Be9MvX37Njk0gM5hylMm_18nPTerXiGGBnlDWWyJFjQct7x-yZJMBv_Au3p0Wn--fL3iVX9xhQuOhfxdLrk1EGafS6eV9i61P-BTlEQ83TIUMxVlP3gKqEF2Pzchk_jwOg-_goIDZ6nVtYxPnXYnn8hSiFxpdU9vEKQrRXGPVKmldk9HLO_r-vCQ4";

function FloatingCard({
  image,
  title,
  className,
  delay = 0,
}: {
  image: string;
  title: string;
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute w-[200px] animate-float rounded-3xl border-2 border-primary/10 bg-white p-4 shadow-float ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <RemoteImage src={image} alt="" width={400} sizes="200px" className="h-32 w-full rounded-2xl" />
      <p className="t-label mt-4 text-center">{title}</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="px-6 pb-12 pt-10 md:px-8 md:pb-20 md:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <div>
          <h1 className="t-display">
            Own What{" "}
            <span className="text-primary underline decoration-primary-container decoration-4 underline-offset-[10px]">
              Shouldn&apos;t
            </span>{" "}
            Be Owned.
          </h1>
          <p className="t-body-lg mt-8 max-w-xl text-on-surface-variant">
            Premium bottled experiences, certified feelings, and other essentials for the discerning
            absurd-ist.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 md:mt-12">
            <LinkButton href="/categories" size="xl">
              Browse Impossible
            </LinkButton>
            <LinkButton href="/about" variant="soft" size="xl">
              How it works
            </LinkButton>
          </div>
        </div>

        <div className="relative hidden h-[500px] place-items-center md:grid" aria-hidden>
          <div className="blob-hero size-[500px] bg-secondary-container/30" />
          <FloatingCard image={EVEREST_AIR} title="Everest Air" className="-top-10 left-0" />
          <FloatingCard
            image={JAN_FIRST}
            title="Jan 1st Motivation"
            className="-bottom-10 right-0"
            delay={1500}
          />
          <span className="absolute text-[80px] leading-none">✨</span>
        </div>
      </div>
    </section>
  );
}
