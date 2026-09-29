import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is this legal?",
    answer:
      "In most dimensions, yes. We have a team of inter-dimensional lawyers who specialize in the legality of non-corporeal assets and metaphysical trade.",
  },
  {
    question: "How do I return a feeling?",
    answer:
      "Feelings are non-returnable once felt. However, if you experience a feeling other than the one purchased, please contact our Void Support team.",
  },
  {
    question: "What if the bottle breaks?",
    answer:
      "Please vacate the room immediately. The concentrated absurdity levels might cause temporary spontaneous accordion-playing or sudden cravings for purple broccoli.",
  },
];

export function Faq() {
  return (
    <section className="bg-surface-container-highest/20 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="t-headline-lg text-center">Existential Queries</h2>
        <div className="mt-12 flex flex-col gap-6">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-3xl bg-primary-container p-6 shadow-[0_5px_10px_rgb(0_0_0/0.02)] transition-shadow open:shadow-[0_10px_20px_rgb(0_0_0/0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="t-headline-md !text-xl text-on-primary-container">{question}</h3>
                <ChevronDown
                  className="size-6 shrink-0 text-on-primary-container transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="t-body-md mt-4 text-on-primary-container/90">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
