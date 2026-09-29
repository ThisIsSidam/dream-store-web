import { AlarmClock, Sparkles, Zap } from "lucide-react";

function Cloud({ className }: { className: string }) {
  return <span className={`absolute rounded-full bg-white ${className}`} aria-hidden />;
}

export function SignInHero() {
  return (
    <div className="hidden lg:block">
      <div className="mx-auto grid aspect-square w-full max-w-[380px] place-items-center rounded-[44px] border-4 border-surface/90 bg-surface/70 p-4 shadow-[0_18px_34px_color-mix(in_srgb,var(--color-primary)_8%,transparent)] lg:mx-0">
        <div className="relative size-full overflow-hidden rounded-[30px] bg-gradient-to-b from-secondary/95 to-primary-container/90">
          <Cloud className="left-4 top-6 h-8 w-14 opacity-50" />
          <Cloud className="right-6 top-14 h-6 w-11 opacity-60" />
          <Cloud className="bottom-6 left-5 h-10 w-16 opacity-45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5">
            <span className="grid size-20 place-items-center rounded-full bg-white/85 shadow-[0_10px_18px_rgb(0_0_0/0.08)]">
              <AlarmClock className="size-11 text-primary" aria-hidden />
            </span>
            <Sparkles className="size-5 text-white/95" aria-hidden />
          </div>
        </div>
      </div>
      <div className="mt-11 max-w-[520px]">
        <p className="t-headline-lg font-extrabold italic text-primary">
          “Welcome back. We’ve been expecting you since next Tuesday.”
        </p>
        <p className="t-body-lg mt-4 text-on-surface-variant">
          Please secure your consciousness before proceeding through the portal.
        </p>
      </div>
    </div>
  );
}

export function SignUpHero() {
  return (
    <div className="relative hidden max-w-[540px] lg:block">
      <div className="absolute -left-2 top-0 size-[90%] rounded-[36%] bg-secondary-container/90" aria-hidden />
      <div className="absolute -top-8 right-8 size-[45%] rounded-[40%] bg-primary-container/15" aria-hidden />
      <div className="relative rounded-[72px] bg-secondary-container px-10 pb-9 pt-12 shadow-[0_20px_40px_color-mix(in_srgb,var(--color-secondary)_12%,transparent)]">
        <span className="t-caption inline-block rounded-full bg-tertiary-container px-3.5 py-1.5 text-[11px] uppercase tracking-wider text-on-tertiary-container">
          Actually Impossible
        </span>
        <p className="t-headline-lg mt-6 max-w-[420px] font-extrabold text-on-secondary-container">
          Join 10,000+ other entities in the void.
        </p>
        <p className="t-body-lg mt-5 max-w-[460px] text-on-secondary-container">
          Our metaphysical benefits package includes unlimited access to dream-loops, zero-gravity customer
          support, and a complimentary “Sense of Belonging” bottled at source.
        </p>
        <ul className="mt-7 flex flex-col gap-[18px]">
          {[
            { icon: Sparkles, text: "Paradox-free security as standard" },
            { icon: Zap, text: "Temporal causality protection" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-full bg-white/60 text-secondary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="t-label !text-[15px] text-on-secondary-container">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
