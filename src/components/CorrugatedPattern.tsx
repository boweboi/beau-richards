type Props = {
  id: string;
  className?: string;
  color?: string;
  opacity?: number;
};

/**
 * A repeating corrugated-iron profile, rendered as an SVG pattern.
 * Corrugated iron is the single most recognisable material on a Kiwi
 * house — used here as a quiet structural motif instead of a generic
 * gradient or blob.
 */
export default function CorrugatedPattern({
  id,
  className,
  color = "#ffffff",
  opacity = 0.08,
}: Props) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          width="28"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          <path
            d="M0 20 Q7 4 14 20 T28 20"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={opacity}
          />
          <path
            d="M0 40 Q7 24 14 40 T28 40"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={opacity}
          />
          <path
            d="M0 0 Q7 -16 14 0 T28 0"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
