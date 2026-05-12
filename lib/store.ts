import { create } from "zustand";
import { AppState } from "@/types";

// Total real slides: 1(title) + 1(MAs) + 3(video) + 5(presentations, each with a placeholder after some) + 1(thankyou)
// Slides array: 1,2,3,4,5, 7,7p, 8,8p, 9, 10,10p, 11,11p, 12
// = 15 slides total
const TOTAL_SLIDES = 15;

export const useAppStore = create<AppState>((set) => ({
  currentSlide: 0,
  editMode: false,
  totalSlides: TOTAL_SLIDES,
  setCurrentSlide: (index) =>
    set({ currentSlide: Math.max(0, Math.min(index, TOTAL_SLIDES - 1)) }),
  nextSlide: () =>
    set((s) => ({ currentSlide: Math.min(s.currentSlide + 1, TOTAL_SLIDES - 1) })),
  prevSlide: () =>
    set((s) => ({ currentSlide: Math.max(s.currentSlide - 1, 0) })),
  setEditMode: (val) => set({ editMode: val }),
}));
