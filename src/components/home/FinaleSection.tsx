import Link from "next/link";
import { SITE } from "@/lib/data/site";
import { TEXT_LOOPS } from "@/lib/data/textLoops";
import Reveal from "./Reveal";
import TextLoop from "./TextLoop";

/** Chapter V — Horizon. The closing image of the voyage, handing off to the footer. */
export default function FinaleSection() {
  return (
    <section
      id="horizon"
      aria-labelledby="horizon-title"
      className="iv-finale relative z-10 flex min-h-[100svh] w-full flex-col items-center overflow-x-clip px-6 pb-32 pt-10"
    >
      <div className="iv-finale__eclipse" aria-hidden="true">
        <div className="iv-finale__corona" />
        <div className="iv-finale__ring" />
        <div className="iv-finale__disc" />
      </div>
      <div className="iv-finale__horizon-wrap" aria-hidden="true">
        <div className="iv-finale__horizon" />
      </div>

      {/* Third text loop: sits just under the curved edge that slides over the gallery */}
      <TextLoop band={TEXT_LOOPS.tagline} className="tl--inset" />

      <div className="relative z-10 my-auto flex max-w-3xl flex-col items-center pt-16 text-center">
        <Reveal variant="fade" className="flex items-center gap-3">
          <span className="iv-chapter__numeral" aria-hidden="true">
            V
          </span>
          <span className="iv-chapter__rule" aria-hidden="true" />
          <span className="iv-eyebrow">Horizon</span>
        </Reveal>

        <Reveal variant="focus" delay={120}>
          <h2 id="horizon-title" className="iv-display mt-6 text-[clamp(2.4rem,7vw,6rem)]">
            The odyssey <em>awaits</em>
          </h2>
        </Reveal>

        <Reveal variant="rise" delay={260}>
          <p className="iv-body mx-auto mt-6 max-w-lg">
            Claim your place among the stars at {SITE.name} {SITE.edition}, {SITE.institute}.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={380} className="mt-12 flex flex-col items-center gap-5 sm:flex-row">
          <Link href="/register" className="iv-btn-primary group">
            <span className="iv-btn-primary__core">
              <span className="iv-btn-primary__texture" aria-hidden="true" />
              <span className="iv-btn-primary__glint" aria-hidden="true" />
              <span className="relative z-10 text-sm font-black uppercase tracking-[0.35em] text-white font-serif">
                Register now
              </span>
            </span>
          </Link>
          <Link href="/events" className="iv-btn-ghost">
            Explore the events <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
