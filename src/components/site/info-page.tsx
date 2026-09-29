import { PageShell } from "./page-shell";

export function InfoPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: string;
  sections?: { id?: string; heading: string; body: string }[];
  children?: React.ReactNode;
}) {
  return (
    <PageShell width="max-w-3xl">
      <article className="bg-white p-6 shadow-soft sm:p-10">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-on-surface-variant">{intro}</p>
        <div className="mt-8 flex flex-col gap-7">
          {sections?.map(({ id, heading, body }) => (
            <section key={heading} id={id} className="scroll-mt-28">
              <h2 className="font-display text-lg font-semibold">{heading}</h2>
              <p className="mt-2 leading-relaxed text-on-surface-variant">{body}</p>
            </section>
          ))}
          {children}
        </div>
      </article>
    </PageShell>
  );
}
