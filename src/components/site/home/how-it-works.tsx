import { ArrowRight, Compass, HelpCircle, ShoppingCart } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Discover",
      desc: "Find something you didn't know existed, and certainly didn't know could be packaged and shipped via standard ground courier.",
      icon: Compass,
    },
    {
      num: "02",
      title: "Question Your Decision",
      desc: "Carefully read the specifications, review the questionable origins, and consult your internal monologue with growing concern.",
      icon: HelpCircle,
    },
    {
      num: "03",
      title: "Buy It Anyway",
      desc: "Select your variant, enter your shipping address, provide payment details, and wait for reality to arrive in a discreet cardboard box.",
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="border-b border-neutral-200/80 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1360px] px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600">
            Protocol Overview
          </span>
          <h2 className="mt-2 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            How shopping works here
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            A standardized, three-stage progression from innocent curiosity to
            permanent ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col rounded-xl border border-neutral-200/90 bg-neutral-50/50 p-6 sm:p-8 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-black text-indigo-600/80">
                    {step.num}
                  </span>
                  <div className="grid size-10 place-items-center rounded-lg bg-white border border-neutral-200 text-neutral-700 shadow-2xs">
                    <Icon className="size-5 text-indigo-600" />
                  </div>
                </div>

                <h3 className="font-sans text-lg font-bold text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {step.desc}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-neutral-400">
                    <ArrowRight className="size-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
