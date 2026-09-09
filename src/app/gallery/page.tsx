"use client";

import Image from "next/image";
import Gallery from "@/components/Gallery";

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Same space background as home & events pages */}
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
        <Gallery />
      </div>
    </main>
  );
}
