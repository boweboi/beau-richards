import CheckboxOption from "@/components/CheckboxOption";
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
          <CheckboxOption
            key={category}
            name="categories"
            value={category}
            defaultChecked={defaultSelected.includes(category)}
            labelClassName="h-full"
          >
            {category}
          </CheckboxOption>
        ))}
      </div>
    </fieldset>
  );
}
