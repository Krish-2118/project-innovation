// Voices from participants, speakers and organisers, shown in the homepage
// "Transmissions" section.
//
// Only add real, attributed quotes that the person has agreed to publish.
// While this list is empty the section shows an "awaiting transmissions"
// state that invites visitors to share their story.
//
// Example entry:
// {
//   quote: "…",
//   name: "Full Name",
//   role: "Participant, Hack Innovision",
//   edition: "2025",
// }

export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Participant, Robo Wars" or "Speaker" */
  role: string;
  /** Festival edition the quote refers to, e.g. "2025" */
  edition?: string;
}

export const TESTIMONIALS: Testimonial[] = [];
