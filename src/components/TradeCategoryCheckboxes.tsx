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
            className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-900 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5"
          >
            <input
              type="checkbox"
              name="categories"
              value={category}
              defaultChecked={defaultSelected.includes(category)}
              className="accent-navy-950"
            />
            {category}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
