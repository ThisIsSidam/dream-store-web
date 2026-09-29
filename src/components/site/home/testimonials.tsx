const testimonials = [
  {
    text: "“I opened the 'Motivation from Jan 1st' and finally folded my laundry. It had been in the dryer since 2022. 5/5 stars.”",
    author: "A. Nonymous",
    border: "border-primary-container text-primary-container",
  },
  {
    text: "“The 'Pieces of Silence' actually worked. My toddler stared at the wall for four minutes. It was the most beautiful four minutes of my life.”",
    author: "Exhausted Parent",
    border: "border-secondary-container text-secondary-container",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 rounded-[32px] bg-on-surface p-8 md:p-16 lg:grid-cols-3 lg:gap-16">
        <div>
          <h2 className="t-headline-lg text-primary-container">Humorously Sincere</h2>
          <p className="t-body-lg mt-4 text-white/80">
            Our customers are literally losing their minds (in a good way).
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:col-span-2">
          {testimonials.map(({ text, author, border }) => (
            <figure key={author} className={`rounded-2xl border-l-4 bg-white/5 p-8 ${border.split(" ")[0]}`}>
              <blockquote className="t-body-lg text-white">{text}</blockquote>
              <figcaption className={`t-label mt-4 ${border.split(" ")[1]}`}>— {author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
