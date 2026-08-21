"use client";

import { useEffect, useRef, useState } from "react";

const FADE_SECONDS = 0.6;
const FALLBACK_DURATION_SECONDS = 14.9;

const SEGMENTS = [
  "Local verified tradies ready to quote now.",
  "Sign up now.",
  "TradieMatch",
];

function windowOpacity(time: number, windowStart: number, windowEnd: number) {
  if (time < windowStart || time > windowEnd) return 0;
  if (time < windowStart + FADE_SECONDS) {
    return (time - windowStart) / FADE_SECONDS;
  }
  if (time > windowEnd - FADE_SECONDS) {
    return (windowEnd - time) / FADE_SECONDS;
  }
  return 1;
}

export default function HomeownerHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacities, setOpacities] = useState<number[]>([1, 0, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frameId: number;

    const tick = () => {
      const duration = video.duration || FALLBACK_DURATION_SECONDS;
      const time = video.currentTime;
      const segmentLength = duration / SEGMENTS.length;

      setOpacities(
        SEGMENTS.map((_, index) =>
          windowOpacity(
            time,
            index * segmentLength,
            (index + 1) * segmentLength
          )
        )
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src="/videos/homeowner-recruitment-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      <div className="relative mx-auto grid min-h-[18rem] max-w-2xl -translate-y-8 place-items-center sm:-translate-y-12">
        <h1 className="grid place-items-center">
          {SEGMENTS.map((text, index) => (
            <span
              key={text}
              className="col-start-1 row-start-1 inline-block rounded-md bg-navy-900/85 px-4 py-1.5 font-display text-2xl font-bold text-hivis-500 sm:text-3xl"
              style={{ opacity: opacities[index] }}
            >
              {text}
            </span>
          ))}
        </h1>
      </div>
    </>
  );
}
