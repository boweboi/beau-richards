const COPY: Record<"homeowner" | "tradie", { label: string; href: string }> = {
  homeowner: {
    label: "Homeowner Terms and Conditions",
    href: "/terms-homeowner",
  },
  tradie: {
    label: "Tradie Terms and Conditions",
    href: "/terms-tradie",
  },
};

export default function TermsCheckbox({
  role,
}: {
  role: "homeowner" | "tradie";
}) {
  const { label, href } = COPY[role];

  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-md border border-line px-3 py-2 text-sm text-ink-900 has-[:checked]:border-navy-700 has-[:checked]:bg-navy-950/5">
      <input
        type="checkbox"
        name="agree_terms"
        required
        className="mt-0.5 accent-navy-950"
      />
      <span>
        I agree to the{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-navy-950 underline hover:no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          {label}
        </a>
      </span>
    </label>
  );
}
