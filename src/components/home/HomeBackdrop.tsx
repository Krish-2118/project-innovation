import Image from "next/image";
import ClientConstellationsCanvas from "@/components/home/ClientConstellationsCanvas";

/**
 * The fixed deep-space layer that every homepage chapter floats over, so the
 * whole page reads as one continuous sky rather than stacked panels.
 */
export default function HomeBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <div
        data-parallax="-12"
        data-parallax-scale="1.08"
        className="absolute -inset-12 select-none"
        style={{ transform: "translate3d(0px, 0px, 0) scale(1.08)" }}
      >
        <div className="iv-hero-in iv-hero-in--sky absolute inset-0">
          <Image src="/backdrop.png" alt="" fill loading="eager" sizes="100vw" className="object-cover object-center" />
        </div>
      </div>

      <ClientConstellationsCanvas />

      {/* Vignette keeps the edges of the frame dark and cinematic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,7,18,0.75)_100%)]" />
      {/* Fine film grain */}
      <div className="iv-grain absolute inset-0" />
    </div>
  );
}
