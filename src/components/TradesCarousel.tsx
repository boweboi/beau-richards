import { TRADE_CATEGORIES } from "@/lib/tradeCategories";

function TradeNames({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <span aria-hidden={ariaHidden} className="flex shrink-0 items-center gap-2">
      {TRADE_CATEGORIES.map((trade) => (
        <span key={trade} className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm font-medium text-hivis-600">{trade}</span>
          <span className="text-line" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </span>
  );
}

export default function TradesCarousel() {
  return (
    <section className="border-b border-line bg-paper-0 py-3 sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4">
        <h2 className="shrink-0 whitespace-nowrap font-display text-base font-semibold text-hivis-600 sm:text-lg">
          Verified Trades
        </h2>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-2">
            <TradeNames />
            {/* Duplicate set, hidden from assistive tech — see the
                globals.css comment on @keyframes marquee for why this
                makes the loop seamless. */}
            <TradeNames ariaHidden />
          </div>
        </div>
      </div>
    </section>
  );
}
