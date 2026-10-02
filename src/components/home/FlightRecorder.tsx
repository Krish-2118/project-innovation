"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { FLIGHT_RECORDER, GALLERY_PHOTOS, GALLERY_TRAVEL, type FlightPhoto } from "@/lib/data/gallery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import "./flight-recorder.css";

/**
 * Viewport heights held at p = 1 at the end of the flight. The next section is
 * pulled up by 100vh (see flight-recorder.css), so it starts sliding over the
 * pinned hero ~0.3 viewports after the hero arrives, leaving the CTA visible.
 */
const HOLD_VIEWPORTS = 1.3;

function Photo({ photo }: { photo: FlightPhoto }) {
  // Missing or failed images fall back to the striped frame instead of a broken icon.
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={photo.hero ? "fr__photo fr__photo--hero" : "fr__photo"}
      style={
        {
          "--w": photo.width,
          "--h": photo.height,
          "--x": photo.x,
          "--y": photo.y,
          "--z": photo.z,
        } as CSSProperties
      }
    >
      {!failed && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={photo.hero ? "(max-width: 768px) 80vw, 440px" : "(max-width: 768px) 60vw, 340px"}
          loading="lazy"
          decoding="async"
          className="fr__img"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption className="fr__caption">{photo.caption}</figcaption>
    </figure>
  );
}

/**
 * Chapter III — Flight Recorder (Gallery). A pinned stage where scrolling
 * flies a CSS 3D camera forward past photos from past editions, ending on a
 * hero photo. Driven by `--p` (pinned scroll progress, set here) and
 * `--mx`/`--my` (page-wide pointer depth from <PointerDepth />).
 */
export default function FlightRecorder() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { mode: "pinned", holdViewports: HOLD_VIEWPORTS });

  const { eyebrow, title, subtitle, cta } = FLIGHT_RECORDER;

  return (
    <section
      ref={ref}
      id="gallery"
      aria-labelledby="gallery-title"
      className="fr"
      style={{ "--travel": GALLERY_TRAVEL, "--hold": HOLD_VIEWPORTS } as CSSProperties}
    >
      <div className="fr__stage">
        <div className="fr__stars" aria-hidden="true" />

        <div className="fr__camera">
          {GALLERY_PHOTOS.map((photo) => (
            <Photo key={photo.src} photo={photo} />
          ))}
        </div>

        <div className="fr__intro">
          <p className="fr__eyebrow">
            <span aria-hidden="true">✦ </span>
            {eyebrow}
            <span aria-hidden="true"> ✦</span>
          </p>
          <h2 id="gallery-title" className="fr__title">
            {title}
          </h2>
          <p className="fr__subtitle">{subtitle}</p>
        </div>

        <Link href={cta.href} className="fr__cta">
          {cta.label} <span aria-hidden="true">✦</span>
        </Link>
      </div>
    </section>
  );
}
