import Image from "next/image";
import EventCarousel from "@/components/events/EventCarousel";

export const metadata = {
  title: "Events | Innovision",
  description: "Explore the space-themed events of Innovision.",
};

export default function EventsPage() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Space background for standalone events page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/bg.png"
          alt="Space Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="relative z-10 w-full h-full">
        <EventCarousel />
      </div>
    </main>
  );
}
