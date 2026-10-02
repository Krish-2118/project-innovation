// Photos for the homepage "Flight Recorder" gallery.
//
// Put image files in /public/gallery/ and reference them as "/gallery/<file>".
// Until a file exists, its frame shows a striped placeholder.
//
// Layout: every photo sits at the centre of the stage and is offset by
// x (vw), y (vh) and z (px, negative = further away). The camera travels
// GALLERY_TRAVEL px forward over the section, so a photo at z = -GALLERY_TRAVEL
// arrives at the lens at the end. Keep photos 1–7 alternating left/right so
// nothing blocks the centre; the last entry (hero) lands dead-centre.
//
// To add photos: append entries before the hero, keep alternating x sides,
// space z about 400px apart, and raise GALLERY_TRAVEL (and the hero's z) so the
// hero still lands at ≈ +50px when p = 1 (z = -(GALLERY_TRAVEL - 50)).

export const GALLERY_TRAVEL = 3200;

export interface FlightPhoto {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Horizontal offset in vw (negative = left). */
  x: number;
  /** Vertical offset in vh (negative = up). */
  y: number;
  /** Depth in px (negative = away from the viewer). */
  z: number;
  hero?: boolean;
}

export const FLIGHT_RECORDER = {
  eyebrow: "Flight Recorder",
  title: "Gallery",
  subtitle: "Fly through past editions.",
  cta: { label: "View full gallery", href: "/gallery" },
};

// Replace src / alt / caption with real photographs from past editions.
export const GALLERY_PHOTOS: FlightPhoto[] = [
  { src: "/gallery/01.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 01", width: 300, height: 210, x: -26, y: -12, z: -300 },
  { src: "/gallery/02.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 02", width: 280, height: 340, x: 24, y: 10, z: -700 },
  { src: "/gallery/03.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 03", width: 340, height: 230, x: -20, y: 14, z: -1100 },
  { src: "/gallery/04.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 04", width: 300, height: 220, x: 26, y: -14, z: -1500 },
  { src: "/gallery/05.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 05", width: 260, height: 320, x: -28, y: -6, z: -1900 },
  { src: "/gallery/06.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 06", width: 340, height: 240, x: 18, y: 16, z: -2300 },
  { src: "/gallery/07.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 07", width: 300, height: 210, x: -12, y: -17, z: -2700 },
  { src: "/gallery/08.jpg", alt: "A moment from a past edition of Innovision", caption: "ARCHIVE · 08", width: 440, height: 290, x: 0, y: -2, z: -3150, hero: true },
];
