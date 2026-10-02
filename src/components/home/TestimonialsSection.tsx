import { SITE } from "@/lib/data/site";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import ChapterHeading from "./ChapterHeading";
import Reveal from "./Reveal";
import TransmissionCarousel from "./TransmissionCarousel";

const WAVE_PATH = Array.from({ length: 49 }, (_, i) => {
  const x = i * 25;
  // A soft carrier wave with a burst in the middle, like a signal being received.
  const envelope = Math.exp(-Math.pow((i - 24) / 9, 2));
  const y = 40 + Math.sin(i * 1.3) * (4 + envelope * 26);
  return `${i === 0 ? "M" : "L"} ${x} ${y.toFixed(1)}`;
}).join(" ");

/** Chapter II — Transmissions. The human voices of the odyssey. */
export default function TestimonialsSection() {
  const hasVoices = TESTIMONIALS.length > 0;
  const shareHref = `mailto:${SITE.email}?subject=${encodeURIComponent("My Innovision story")}`;

  return (
    <section
      id="transmissions"
      aria-labelledby="transmissions-title"
      className="iv-transmissions relative z-10 w-full overflow-hidden py-28 lg:py-40"
    >
      <div className="iv-transmissions__atmosphere" aria-hidden="true" />

      {/* Receiving satellite */}
      <div className="iv-satellite" aria-hidden="true">
        <span className="iv-satellite__pulse" />
        <span className="iv-satellite__pulse iv-satellite__pulse--2" />
        <span className="iv-satellite__pulse iv-satellite__pulse--3" />
        <div className="iv-satellite__craft" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 lg:pl-28">
        <ChapterHeading
          numeral="II"
          chapter="Transmissions"
          id="transmissions-title"
          align="center"
          tone="gold"
          title={
            <>
              Voices from the <em>odyssey</em>
            </>
          }
        />

        <Reveal variant="fade" delay={150} className="mx-auto mt-14 w-full max-w-3xl">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="iv-wave h-16 w-full" aria-hidden="true">
            <path d={WAVE_PATH} className="iv-wave__ghost" />
            <path d={WAVE_PATH} className="iv-wave__signal" pathLength={1} />
          </svg>
        </Reveal>

        <div className="mt-12">
          {hasVoices ? (
            <TransmissionCarousel items={TESTIMONIALS} />
          ) : (
            <Reveal variant="rise" delay={200} className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <p className="iv-mono flex items-center gap-3 text-amber-200/80">
                <span className="iv-live-dot" aria-hidden="true" />
                Listening for signals
              </p>
              <p className="iv-quote mt-8">
                Every odyssey is remembered through the people who travel it.
              </p>
              <p className="iv-body mt-6 max-w-xl">
                Stories from the participants, speakers and organisers of Innovision will be received here. Were you
                part of a past edition? We would love to hear from you.
              </p>
              <a href={shareHref} className="iv-btn-ghost mt-10">
                Share your story <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
