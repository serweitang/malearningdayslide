"use client";

import dynamic from "next/dynamic";

const SlideShow = dynamic(
  () => import("@/components/SlideShow").then((m) => ({ default: m.SlideShow })),
  { ssr: false, loading: () => <div className="w-screen h-screen bg-[#0A0C14]" /> }
);

export default function Home() {
  return <SlideShow />;
}
