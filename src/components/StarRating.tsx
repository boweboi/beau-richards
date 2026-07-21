"use client";

import { useState } from "react";

export default function StarRating({
  name,
  label,
  defaultValue = 0,
}: {
  name: string;
  label: string;
  defaultValue?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;

  return (
    <div>
      <span className="block text-sm font-medium text-ink-700">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="mt-1 flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => setValue(star)}
            className="p-0.5 text-2xl leading-none"
          >
            <span
              aria-hidden="true"
              className={star <= displayValue ? "text-hivis-500" : "text-line"}
            >
              ★
            </span>
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
