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
    <PageShell title={title} subtitle={intro} width="max-w-3xl">
      <div className="flex flex-col gap-10">
        {sections?.map(({ id, heading, body }) => (
          <section key={heading} id={id} className="scroll-mt-28">
            <h2 className="t-headline-md !text-2xl">{heading}</h2>
            <p className="t-body-lg mt-3 text-on-surface-variant">{body}</p>
          </section>
        ))}
        {children}
      </div>
    </PageShell>
  );
}
