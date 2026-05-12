"use client";

import { useAppStore } from "@/lib/store";

export function SlideNav() {
  const { currentSlide, totalSlides, nextSlide, prevSlide, setCurrentSlide } = useAppStore();

  return (
    <>
      {/* Left arrow */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition backdrop-blur-sm"
        aria-label="Previous slide"
      >
        ←
      </button>

      {/* Right arrow */}
      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition backdrop-blur-sm"
        aria-label="Next slide"
      >
        →
      </button>

      {/* Dot indicators */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 items-center">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all ${
              i === currentSlide
                ? "w-5 h-2 bg-garena-red"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-4 right-4 z-40 text-white/40 text-xs font-body">
        {currentSlide + 1} / {totalSlides}
      </div>
    </>
  );
}
