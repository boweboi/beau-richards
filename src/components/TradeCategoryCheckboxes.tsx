import { TRADE_CATEGORIES } from "@/lib/tradeCategories";

export default function TradeCategoryCheckboxes({
  defaultSelected = [],
}: {
  defaultSelected?: string[];
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-ink-700">
        Which trades do you do?
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TRADE_CATEGORIES.map((category) => (
          <label
            key={category}
            className="flex min-w-0 cursor-pointer items-start gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-900 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5"
          >
            <input
              type="checkbox"
              name="categories"
              value={category}
              defaultChecked={defaultSelected.includes(category)}
              className="mt-0.5 shrink-0 accent-navy-950"
            />
            <span className="flex-1 break-words leading-snug">{category}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
