import { Filter, Factory, Flower2, type LucideIcon } from "lucide-react";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
}[] = [
  {
    icon: Filter,
    title: "The Magical Funnel",
    description:
      "We distill raw cosmic energy and human quirks through a proprietary seventeen-stage filter.",
    accent: "border-primary text-primary",
    iconBg: "bg-primary-container/20",
  },
  {
    icon: Factory,
    title: "Bottling Machine",
    description:
      "Our high-pressure canisters ensure that not even a single ounce of irony escapes during sealing.",
    accent: "border-secondary text-secondary",
    iconBg: "bg-secondary-container/20",
  },
  {
    icon: Flower2,
    title: "QA Penguin",
    description:
      "Every batch is personally sniffed and approved by our Quality Assurance Penguin, Sir Barnaby.",
    accent: "border-tertiary text-tertiary",
    iconBg: "bg-tertiary-container/30",
  },
];

export function Alchemy() {
  return (
    <section id="process" className="bg-tertiary-container/10 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-headline-lg text-center">The Alchemy of the Absurd</h2>
        <div className="relative mt-16 md:mt-20">
          <div className="absolute inset-x-24 top-1/2 hidden h-1 bg-tertiary/20 lg:block" aria-hidden />
          <ol className="relative grid gap-8 lg:grid-cols-3 lg:gap-6">
            {steps.map(({ icon: Icon, title, description, accent, iconBg }) => (
              <li
                key={title}
                className={`mx-auto flex w-full max-w-[320px] flex-col items-center rounded-[32px] border-b-8 bg-primary-container p-10 text-center shadow-[0_20px_40px_rgb(0_0_0/0.05)] ${accent.split(" ")[0]}`}
              >
                <span className={`grid size-24 place-items-center rounded-full ${iconBg} ${accent.split(" ")[1]}`}>
                  <Icon className="size-10" aria-hidden />
                </span>
                <h3 className="t-headline-md mt-6 !text-2xl text-on-primary-container">{title}</h3>
                <p className="t-body-md mt-4 text-on-primary-container/90">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
