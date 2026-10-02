import Image from "next/image";
import Gallery from "@/components/Gallery";
import SpacecraftCursor from "@/components/about/SpacecraftCursor";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";

export default function GalleryPage() {
  return (
    <MouseParallaxContainer className="relative min-h-screen text-white overflow-hidden">
      <SpacecraftCursor />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          data-parallax="-12"
          data-parallax-scale="1.05"
          className="absolute -inset-8 will-change-transform"
          style={{
            transform: `translate3d(0px, 0px, 0) scale(1.05)`,
          }}
        >
          <Image
            src="/backdrop.png"
            alt="Space Background"
            fill
            priority
            className="object-cover object-center opacity-95"
          />
        </div>
      </div>
      <div className="relative z-10 w-full h-full">
        <Gallery />
      </div>
    </MouseParallaxContainer>
  );
}
