import Image from "next/image";

export default function AdImagePage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-navy-950 px-6"
      style={{ width: "1080px", height: "1350px", margin: 0, overflow: "hidden" }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <h1
          className="max-w-[900px] font-display text-[88px] font-bold leading-[0.95] tracking-[-0.06em] text-hivis-500"
          style={{ letterSpacing: "-0.06em" }}
        >
          Need a tradie in Wellington?
        </h1>

        <p className="mt-8 font-sans text-[38px] font-medium leading-relaxed text-white/90">
          Post your job once. It&apos;s free.
        </p>

        <div
          className="mt-6 flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
          style={{ width: "fit-content" }}
        >
          <Image
            src="/favicon.png"
            alt="TradieMatch logo"
            width={40}
            height={40}
            priority
            className="h-[40px] w-[40px] object-contain"
          />

          <span className="font-display text-[21px] font-bold leading-none text-navy-950">
            TradieMatch
          </span>
        </div>
      </div>
    </main>
  );
}
