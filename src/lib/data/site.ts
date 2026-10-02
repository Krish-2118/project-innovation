// Shared, authoritative facts about the festival used across the site.
// Keep this file limited to verified information.

export const SITE = {
  name: "INNOVISION",
  edition: "2026",
  theme: "The Celestial Odyssey",
  institute: "NIT Rourkela",
  location: "Rourkela, Odisha, India",
  tagline: "Where Ideas Transcend Boundaries.",
  email: "innovision@nitrkl.ac.in",
  // NIT Rourkela campus, rounded to two decimals.
  coordinates: "22.25° N · 84.90° E",
} as const;

export type SocialPlatform = "instagram" | "linkedin" | "youtube";

// Official social profiles. Leave `href` empty until the URL is confirmed —
// empty entries are not rendered, so the site never ships a dead link.
export const SOCIAL_LINKS: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: "instagram", label: "Instagram", href: "" },
  { platform: "linkedin", label: "LinkedIn", href: "" },
  { platform: "youtube", label: "YouTube", href: "" },
];

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Merch", href: "/merch" },
] as const;
