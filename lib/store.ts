import { create } from "zustand";
import { AppState } from "@/types";

// 0=Title, 1=MAIntro, 2-4=Videos, 5=Joyce, 6=Joyce slides, 7=Iris, 8=Iris slides,
// 9=Joan, 10=Joan slides, 11=YanWei, 12=YanWei launch, 13=Mitty, 14=Mitty launch, 15=ThankYou
const TOTAL_SLIDES = 16;

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
