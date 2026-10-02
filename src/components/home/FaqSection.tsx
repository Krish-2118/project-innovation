import { FAQS } from "@/lib/data/faqs";
import { SITE } from "@/lib/data/site";
import ChapterHeading from "./ChapterHeading";
import FaqAccordion from "./FaqAccordion";
import Reveal from "./Reveal";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

/** Chapter IV — Navigation. Essential information, charted. */
export default function FaqSection() {
  return (
    <section id="navigation" aria-labelledby="navigation-title" className="iv-navigation relative z-10 w-full py-28 lg:py-40">
      <div className="iv-navigation__atmosphere" aria-hidden="true" />
      <svg className="iv-starchart" viewBox="0 0 800 800" aria-hidden="true">
        {[120, 220, 320, 420, 520].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} />
        ))}
        {Array.from({ length: 12 }, (_, i) => i * 15).map((deg) => (
          <ellipse key={deg} cx="400" cy="400" rx={520 * Math.abs(Math.cos((deg * Math.PI) / 180)) + 1} ry="520" />
        ))}
      </svg>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:pl-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <ChapterHeading
              numeral="IV"
              chapter="Navigation"
              id="navigation-title"
              tone="teal"
              title={
                <>
                  Questions, <em>charted</em>
                </>
              }
            >
              <p className="iv-body">Everything you need to plot your course through Innovision {SITE.edition}.</p>
            </ChapterHeading>

            <Reveal variant="rise" delay={300} className="iv-contact-card mt-12">
              <p className="iv-mono text-teal-200/70">Still lost in space?</p>
              <p className="mt-3 text-slate-200/85">Our crew is a message away.</p>
              <a href={`mailto:${SITE.email}`} className="iv-link mt-4 inline-block break-all">
                {SITE.email}
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal variant="rise" delay={150} className="lg:col-span-7">
          <FaqAccordion items={FAQS} />
        </Reveal>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
