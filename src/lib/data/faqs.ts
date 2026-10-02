import { SITE } from "./site";

// Homepage FAQs. Answers describe how the site works today; update them
// alongside any change to registration, events or contact details.

export interface Faq {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export const FAQS: Faq[] = [
  {
    question: "What is Innovision?",
    answer: `Innovision is ${SITE.institute}'s festival where technology, innovation and creativity meet. The ${SITE.edition} edition takes the form of ${SITE.theme} — a journey across technical, cultural, gaming and informal events and hands-on workshops.`,
    link: { label: "Read our story", href: "/about" },
  },
  {
    question: "Where does it take place?",
    answer: `On the campus of ${SITE.institute}, in ${SITE.location}.`,
  },
  {
    question: "How do I register?",
    answer:
      "Sign in with your Google account or with a one-time code sent to your email, then complete a short form with your name, email, phone number and college.",
    link: { label: "Register now", href: "/register" },
  },
  {
    question: "Where can I find the events and schedule?",
    answer:
      "The Events page lists every event with its venue, timing, team size and rules, alongside a day-by-day schedule of the festival.",
    link: { label: "Explore events", href: "/events" },
  },
  {
    question: "How do I check my registration?",
    answer:
      "Once you have registered, sign in and open My Registration to see your confirmed pass. Your dashboard keeps your details in one place.",
    link: { label: "My registration", href: "/my-registration" },
  },
  {
    question: "Is there official merchandise?",
    answer: "Yes — the Innovision 2026 collection is on the Merch page.",
    link: { label: "Browse merch", href: "/merch" },
  },
  {
    question: "Who can I contact with other questions?",
    answer: `Write to the team at ${SITE.email} and we'll get back to you.`,
    link: { label: SITE.email, href: `mailto:${SITE.email}` },
  },
];
