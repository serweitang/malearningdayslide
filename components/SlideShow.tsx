"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { SlideNav } from "@/components/ui/SlideNav";
import { LoginModal } from "@/components/ui/LoginModal";
import { PlaceholderSlide } from "@/components/ui/PlaceholderSlide";
import { Slide1_Title } from "@/components/slides/Slide1_Title";
import { Slide2_MAIntro } from "@/components/slides/Slide2_MAIntro";
import { VideoPlaceholderSlide } from "@/components/slides/Slide3_6_VideoPlaceholder";
import { PresentationSlide } from "@/components/slides/Slide7_Presentation";
import { Slide12_ThankYou } from "@/components/slides/Slide12_ThankYou";
import { GoogleSlidesEmbed } from "@/components/slides/GoogleSlidesEmbed";
import { LaunchSlide } from "@/components/slides/LaunchSlide";
import { useAuth } from "@/lib/hooks/useAuth";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

// MA photo paths for presentation slides (matches seed data)
const PRESENTATION_SLIDES = [
  { presenter: "Joyce Jin Yingjie", rotationTitle: "Free Fire Regional Ops (Product)", rotationNumber: "2nd", maPhotoPath: "ma-photos/joyce.jpg", maId: 3 },
  { presenter: "Iris Xia Zhiyu",    rotationTitle: "Free Fire BD Marketing",           rotationNumber: "3rd", maPhotoPath: "ma-photos/iris.jpg",   maId: 1 },
  { presenter: "Joan Chin",          rotationTitle: "Delta Force Regional Marketing",   rotationNumber: "1st", maPhotoPath: "ma-photos/joan.jpg",   maId: 6 },
  { presenter: "Yan Wei",            rotationTitle: "SG Roblox Game Design",            rotationNumber: "2nd", maPhotoPath: "ma-photos/yanwei.jpg", maId: 4 },
  { presenter: "Zhuang Yuan (Mitty)",rotationTitle: "Executive Office",                 rotationNumber: "1st", maPhotoPath: "ma-photos/mitty.jpg",  maId: 5 },
];

// Slides array — each entry is a component to render
// Index: 0=Title, 1=MA Intro, 2=Video3, 3=Video4, 4=Video5,
//        5=Joyce intro, 6=Joyce slides, 7=Iris intro, 8=Iris slides, 9=Joan intro,
//        10=Joan slides, 11=YanWei intro, 12=Placeholder, 13=Mitty intro, 14=Placeholder, 15=ThankYou
const SLIDES: React.ComponentType[] = [
  Slide1_Title,
  Slide2_MAIntro,
  () => <VideoPlaceholderSlide slideNumber={3} />,
  () => <VideoPlaceholderSlide slideNumber={4} />,
  () => <VideoPlaceholderSlide slideNumber={5} />,
  () => <PresentationSlide {...PRESENTATION_SLIDES[0]} />,
  () => <GoogleSlidesEmbed embedUrl="https://docs.google.com/presentation/d/1iIVJrB7-s7V_hxN6lG0QVXpwXtnd0SgBxxeaBK1XT24/embed?rm=minimal" presenterName="Joyce Jin Yingjie" />,
  () => <PresentationSlide {...PRESENTATION_SLIDES[1]} />,
  () => <GoogleSlidesEmbed embedUrl="https://docs.google.com/presentation/d/1J0DyBWnIR4T_wjSEh0er3zxc-LOVQTWv71xlwzfsgLU/embed?rm=minimal" presenterName="Iris Xia Zhiyu" />,
  () => <PresentationSlide {...PRESENTATION_SLIDES[2]} />,
  () => <GoogleSlidesEmbed embedUrl="https://docs.google.com/presentation/d/17NDmgGJGO9ks3gJb48BowA0uyq5pzySz/embed?rm=minimal" presenterName="Joan Chin" />,
  () => <PresentationSlide {...PRESENTATION_SLIDES[3]} />,
  () => <LaunchSlide url="https://yw-learning-day-2.run.ingarena.net/" presenterName="Yan Wei" />,
  () => <PresentationSlide {...PRESENTATION_SLIDES[4]} />,
  () => <LaunchSlide url="MITTY_URL_HERE" presenterName="Zhuang Yuan (Mitty)" />,
  Slide12_ThankYou,
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export function SlideShow() {
  const { currentSlide, nextSlide, prevSlide } = useAppStore();
  const editMode = useAppStore((s) => s.editMode);
  useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const prevIndexRef = useRef(currentSlide);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    setScale(Math.min(window.innerWidth / SLIDE_W, window.innerHeight / SLIDE_H));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  useEffect(() => {
    setDirection(currentSlide > prevIndexRef.current ? 1 : -1);
    prevIndexRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setLoginOpen((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide]);

  const SlideComponent = SLIDES[currentSlide];

  return (
    <div className="w-screen h-screen bg-[#0A0C14] overflow-hidden flex items-center justify-center">
      {/* Lock/Edit button — fixed to viewport */}
      <button
        onClick={() => setLoginOpen(true)}
        title={editMode ? "Edit mode active" : "Admin login"}
        className="fixed top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
      >
        {editMode ? (
          <svg className="w-4 h-4 text-garena-red" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Fixed 16:9 slide canvas — scales proportionally to fit any viewport */}
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      <SlideNav />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
