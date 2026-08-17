import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxOptionProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  labelClassName?: string;
  inputClassName?: string;
};

export default function CheckboxOption({
  children,
  labelClassName = "",
  inputClassName = "",
  className = "",
  ...inputProps
}: CheckboxOptionProps) {
  return (
    <label
      className={[
        "flex w-full min-w-0 cursor-pointer items-start gap-2 rounded-md border border-line px-3 py-2 text-[0.75rem] leading-snug text-ink-900 sm:text-sm has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5",
        labelClassName,
        className,
      ].join(" ")}
    >
      <input
        {...inputProps}
        type="checkbox"
        className={[
          "mt-0.5 shrink-0 accent-navy-950",
          inputClassName,
        ].join(" ")}
      />
      <span className="min-w-0 flex-1 whitespace-normal">{children}</span>
    </label>
  );
}
