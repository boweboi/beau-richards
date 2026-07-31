// Ballpark cost estimators for homeowners, shown at /estimators. These are
// NOT sourced from any TradieMatch pricing data — they're rough NZ market
// ranges, and several categories (painting's interior/exterior split,
// guttering's complexity surcharge, etc.) apply a reasonable adjustment
// percentage on top of a single sourced range rather than a distinct
// sourced figure per option, because the underlying research didn't split
// them out. Where a category (landscaping) had no usable pricing at all,
// the estimator says so instead of inventing a number. Always shown with a
// "get a real quote" disclaimer — see EstimatorResult.note and the
// disclaimer rendered on every estimator page.

export type EstimatorFieldOption = { value: string; label: string };

export type NumberField = {
  type: "number";
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
};

export type SelectField = {
  type: "select";
  key: string;
  label: string;
  options: EstimatorFieldOption[];
  defaultValue: string;
};

export type CheckboxField = {
  type: "checkbox";
  key: string;
  label: string;
  defaultValue: boolean;
};

export type EstimatorField = NumberField | SelectField | CheckboxField;

export type EstimatorInputs = Record<string, number | string | boolean>;

export type EstimatorResult = {
  // Absent when the category has no reliable ballpark (see "landscaping").
  min?: number;
  max?: number;
  breakdown: string[];
  // Extra context shown alongside (or instead of) the range — used for
  // "no reliable range" categories and for regulatory call-outs (asbestos).
  note?: string;
};

export type EstimatorCategory =
  | "Outdoor & structural"
  | "Exterior"
  | "Renovations"
  | "Interior systems"
  | "Specialist";

export type EstimatorConfig = {
  slug: string;
  name: string;
  category: EstimatorCategory;
  description: string;
  fields: EstimatorField[];
  calculate: (inputs: EstimatorInputs) => EstimatorResult;
};

export function formatNzd(value: number): string {
  return value.toLocaleString("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 0,
  });
}

export function getDefaultInputs(config: EstimatorConfig): EstimatorInputs {
  return Object.fromEntries(config.fields.map((field) => [field.key, field.defaultValue]));
}

function asNumber(value: EstimatorInputs[string]): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

function asString(value: EstimatorInputs[string]): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: EstimatorInputs[string]): boolean {
  return value === true;
}

const ESTIMATOR_LIST: EstimatorConfig[] = [
  // ---------------------------------------------------------------
  // Outdoor & structural
  // ---------------------------------------------------------------
  {
    slug: "deck",
    name: "Deck building",
    category: "Outdoor & structural",
    description: "New timber or composite deck, including common add-ons.",
    fields: [
      {
        type: "number",
        key: "size_sqm",
        label: "Deck size",
        unit: "m²",
        min: 4,
        max: 150,
        defaultValue: 20,
      },
      {
        type: "select",
        key: "material_type",
        label: "Decking material",
        defaultValue: "treated_pine",
        options: [
          { value: "treated_pine", label: "Treated pine" },
          { value: "hardwood_kwila", label: "Hardwood (kwila)" },
          { value: "composite", label: "Composite" },
        ],
      },
      { type: "checkbox", key: "has_stairs", label: "Includes stairs", defaultValue: false },
      {
        type: "checkbox",
        key: "has_handrails",
        label: "Includes handrails",
        defaultValue: false,
      },
      {
        type: "checkbox",
        key: "elevated",
        label: "Elevated 1.5m+ off the ground",
        defaultValue: false,
      },
    ],
    calculate(inputs) {
      const size = asNumber(inputs.size_sqm);
      const material = asString(inputs.material_type);
      const rates: Record<string, [number, number]> = {
        treated_pine: [250, 400],
        hardwood_kwila: [450, 650],
        composite: [500, 900],
      };
      const [rateMin, rateMax] = rates[material] ?? rates.treated_pine;

      let min = size * rateMin;
      let max = size * rateMax;
      const breakdown = [
        `${size}m² × ${formatNzd(rateMin)}-${formatNzd(rateMax)}/m² = ${formatNzd(min)}-${formatNzd(max)}`,
      ];

      if (asBoolean(inputs.has_stairs)) {
        min += 500;
        max += 500;
        breakdown.push(`Stairs: +${formatNzd(500)}`);
      }
      if (asBoolean(inputs.has_handrails)) {
        min += 300;
        max += 300;
        breakdown.push(`Handrails: +${formatNzd(300)}`);
      }
      if (asBoolean(inputs.elevated)) {
        min += 300;
        max += 700;
        breakdown.push(`Elevated 1.5m+: +${formatNzd(300)}-${formatNzd(700)}`);
      }

      return { min, max, breakdown };
    },
  },
  {
    slug: "fencing",
    name: "Fencing",
    category: "Outdoor & structural",
    description: "New boundary or garden fencing.",
    fields: [
      {
        type: "number",
        key: "length_metres",
        label: "Fence length",
        unit: "m",
        min: 3,
        max: 300,
        defaultValue: 20,
      },
      {
        type: "select",
        key: "fence_type",
        label: "Fence type",
        defaultValue: "standard",
        options: [
          { value: "paling", label: "Paling fence" },
          { value: "standard", label: "Standard timber fence" },
          { value: "tall", label: "Tall fence (over 1.8m)" },
        ],
      },
      { type: "checkbox", key: "gate_required", label: "Include a gate", defaultValue: false },
    ],
    calculate(inputs) {
      const length = asNumber(inputs.length_metres);
      const fenceType = asString(inputs.fence_type);
      const rates: Record<string, [number, number]> = {
        paling: [150, 220],
        standard: [200, 350],
        tall: [230, 400],
      };
      const [rateMin, rateMax] = rates[fenceType] ?? rates.standard;

      let min = length * rateMin;
      let max = length * rateMax;
      const breakdown = [
        `${length}m × ${formatNzd(rateMin)}-${formatNzd(rateMax)}/m = ${formatNzd(min)}-${formatNzd(max)}`,
      ];

      if (asBoolean(inputs.gate_required)) {
        min += 300;
        max += 800;
        breakdown.push(`Gate: +${formatNzd(300)}-${formatNzd(800)}`);
      }

      return { min, max, breakdown };
    },
  },
  {
    slug: "structures",
    name: "Sheds, pergolas & garages",
    category: "Outdoor & structural",
    description: "New freestanding outdoor structures.",
    fields: [
      {
        type: "number",
        key: "size_sqm",
        label: "Structure size",
        unit: "m²",
        min: 4,
        max: 100,
        defaultValue: 15,
      },
      {
        type: "select",
        key: "structure_type",
        label: "Structure type",
        defaultValue: "shed",
        options: [
          { value: "shed", label: "Shed" },
          { value: "pergola", label: "Pergola" },
          { value: "garage", label: "Garage" },
        ],
      },
    ],
    calculate(inputs) {
      const size = asNumber(inputs.size_sqm);
      const min = size * 300;
      const max = size * 1200;
      return {
        min,
        max,
        breakdown: [
          `${size}m² × ${formatNzd(300)}-${formatNzd(1200)}/m² = ${formatNzd(min)}-${formatNzd(max)}`,
        ],
        note: "This range is wide because sheds, pergolas, and garages vary enormously by material, foundation, and consenting requirements.",
      };
    },
  },
  {
    slug: "retaining_walls",
    name: "Retaining walls",
    category: "Outdoor & structural",
    description: "New retaining wall construction.",
    fields: [
      {
        type: "number",
        key: "length_metres",
        label: "Wall length",
        unit: "m",
        min: 2,
        max: 100,
        defaultValue: 15,
      },
      {
        type: "select",
        key: "material",
        label: "Material",
        defaultValue: "timber",
        options: [
          { value: "timber", label: "Timber" },
          { value: "concrete_block", label: "Concrete block" },
          { value: "other", label: "Other / mixed materials" },
        ],
      },
    ],
    calculate(inputs) {
      const length = asNumber(inputs.length_metres);
      const min = length * 300;
      const max = length * 1950;
      return {
        min,
        max,
        breakdown: [
          `${length}m × ${formatNzd(300)}-${formatNzd(1950)}/m = ${formatNzd(min)}-${formatNzd(max)}`,
        ],
        note: "Retaining wall cost swings hugely with height, material, and ground conditions — an engineer's report may be required for taller walls.",
      };
    },
  },
  {
    slug: "landscaping_outdoors",
    name: "Landscaping & outdoor living",
    category: "Outdoor & structural",
    description: "General landscaping, planting, and outdoor living projects.",
    fields: [
      {
        type: "select",
        key: "work_type",
        label: "Type of work",
        defaultValue: "general",
        options: [
          { value: "general", label: "General tidy-up / planting" },
          { value: "paving", label: "Paving or hard landscaping" },
          { value: "full", label: "Full outdoor living redesign" },
        ],
      },
    ],
    calculate() {
      return {
        breakdown: [],
        note: "Landscaping costs vary too widely for a reliable ballpark — from a weekend tidy-up to a full outdoor renovation. Post a job and get direct quotes from local landscapers instead.",
      };
    },
  },

  // ---------------------------------------------------------------
  // Exterior
  // ---------------------------------------------------------------
  {
    slug: "roofing",
    name: "Roofing",
    category: "Exterior",
    description: "Full re-roof or roof repairs.",
    fields: [
      {
        type: "number",
        key: "roof_size_sqm",
        label: "Roof area",
        unit: "m²",
        min: 20,
        max: 400,
        defaultValue: 150,
      },
      {
        type: "select",
        key: "job_type",
        label: "Job type",
        defaultValue: "replace",
        options: [
          { value: "replace", label: "Full re-roof" },
          { value: "repair", label: "Repair only" },
        ],
      },
    ],
    calculate(inputs) {
      const size = asNumber(inputs.roof_size_sqm);
      if (asString(inputs.job_type) === "repair") {
        return {
          min: 3000,
          max: 8000,
          breakdown: [
            "Typical repair job (not scaled by roof area): $3,000-$8,000",
          ],
        };
      }
      const min = size * 35;
      const max = size * 55;
      return {
        min,
        max,
        breakdown: [
          `${size}m² × ${formatNzd(35)}-${formatNzd(55)}/m² = ${formatNzd(min)}-${formatNzd(max)}`,
        ],
      };
    },
  },
  {
    slug: "guttering_drainage",
    name: "Guttering & drainage",
    category: "Exterior",
    description: "New guttering, downpipes, and drainage work.",
    fields: [
      {
        type: "number",
        key: "length_metres",
        label: "Guttering length",
        unit: "m",
        min: 5,
        max: 150,
        defaultValue: 30,
      },
      {
        type: "select",
        key: "complexity",
        label: "Job complexity",
        defaultValue: "standard",
        options: [
          { value: "standard", label: "Standard" },
          { value: "complex", label: "Complex (multiple levels / downpipes)" },
        ],
      },
    ],
    calculate(inputs) {
      const length = asNumber(inputs.length_metres);
      let min = length * 50;
      let max = length * 150;
      const breakdown = [
        `${length}m × ${formatNzd(50)}-${formatNzd(150)}/m = ${formatNzd(min)}-${formatNzd(max)}`,
      ];
      if (asString(inputs.complexity) === "complex") {
        min *= 1.15;
        max *= 1.15;
        breakdown.push("Complex job (multiple levels/downpipes): +15%");
      }
      return { min, max, breakdown };
    },
  },
  {
    slug: "cladding",
    name: "External cladding",
    category: "Exterior",
    description: "New or replacement exterior cladding.",
    fields: [
      {
        type: "select",
        key: "scope",
        label: "Scope of work",
        defaultValue: "partial",
        options: [
          { value: "partial", label: "1-2 elevations" },
          { value: "major", label: "Partial re-clad (larger area)" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        partial: [8300, 8800],
        major: [20000, 22000],
      };
      const [min, max] = buckets[asString(inputs.scope)] ?? buckets.partial;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "glass_replacement",
    name: "Glass & glazing",
    category: "Exterior",
    description: "Window glass replacement or double-glazing retrofits.",
    fields: [
      {
        type: "select",
        key: "job_size",
        label: "Job size",
        defaultValue: "small",
        options: [
          { value: "small", label: "1-3 panes replaced" },
          { value: "retrofit", label: "5-10 windows — double-glazing retrofit" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        small: [380, 420],
        retrofit: [3800, 4200],
      };
      const [min, max] = buckets[asString(inputs.job_size)] ?? buckets.small;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },

  // ---------------------------------------------------------------
  // Renovations
  // ---------------------------------------------------------------
  {
    slug: "bathroom_renovation",
    name: "Bathroom renovation",
    category: "Renovations",
    description: "Full or partial bathroom renovation.",
    fields: [
      {
        type: "select",
        key: "scope",
        label: "Renovation scope",
        defaultValue: "medium_standard",
        options: [
          { value: "small_budget", label: "Small / budget refresh" },
          { value: "medium_standard", label: "Medium / standard" },
          { value: "full_mid_range", label: "Full renovation, mid-range" },
          { value: "luxury", label: "Luxury" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        small_budget: [7800, 12000],
        medium_standard: [14000, 20000],
        full_mid_range: [20000, 35000],
        luxury: [35000, 65000],
      };
      const [min, max] = buckets[asString(inputs.scope)] ?? buckets.medium_standard;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "kitchen_renovation",
    name: "Kitchen renovation",
    category: "Renovations",
    description: "Full or partial kitchen renovation.",
    fields: [
      {
        type: "select",
        key: "scope",
        label: "Renovation scope",
        defaultValue: "mid_range_typical",
        options: [
          { value: "small_refresh", label: "Small refresh" },
          { value: "mid_range_typical", label: "Mid-range (typical)" },
          { value: "premium", label: "Premium" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        small_refresh: [15000, 25000],
        mid_range_typical: [26000, 35000],
        premium: [60000, 173880],
      };
      const [min, max] = buckets[asString(inputs.scope)] ?? buckets.mid_range_typical;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "flooring",
    name: "Flooring installation",
    category: "Renovations",
    description: "New flooring installation.",
    fields: [
      {
        type: "select",
        key: "flooring_type",
        label: "Flooring type & scope",
        defaultValue: "vinyl_laminate",
        options: [
          { value: "vinyl_laminate", label: "Vinyl or laminate (small room)" },
          { value: "engineered_full_home", label: "Engineered timber (full home)" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        vinyl_laminate: [2300, 2700],
        engineered_full_home: [8300, 9700],
      };
      const [min, max] = buckets[asString(inputs.flooring_type)] ?? buckets.vinyl_laminate;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "plasterboard",
    name: "Plasterboard",
    category: "Renovations",
    description: "New plasterboard install or repair.",
    fields: [
      {
        type: "number",
        key: "area_sqm",
        label: "Area",
        unit: "m²",
        min: 5,
        max: 300,
        defaultValue: 50,
      },
      {
        type: "select",
        key: "work_type",
        label: "Work type",
        defaultValue: "new",
        options: [
          { value: "new", label: "New install" },
          { value: "repair", label: "Repair / patch" },
        ],
      },
    ],
    calculate(inputs) {
      const area = asNumber(inputs.area_sqm);
      const min = area * 30;
      const max = area * 80;
      return {
        min,
        max,
        breakdown: [
          `${area}m² × ${formatNzd(30)}-${formatNzd(80)}/m² = ${formatNzd(min)}-${formatNzd(max)}`,
        ],
      };
    },
  },
  {
    slug: "painting",
    name: "Interior & exterior painting",
    category: "Renovations",
    description: "Interior or exterior painting.",
    fields: [
      {
        type: "number",
        key: "area_sqm",
        label: "Area to paint",
        unit: "m²",
        min: 5,
        max: 500,
        defaultValue: 40,
      },
      {
        type: "select",
        key: "scope",
        label: "Interior or exterior",
        defaultValue: "interior",
        options: [
          { value: "interior", label: "Interior" },
          { value: "exterior", label: "Exterior" },
        ],
      },
      {
        type: "select",
        key: "surface_condition",
        label: "Surface condition",
        defaultValue: "good",
        options: [
          { value: "good", label: "Good — minimal prep" },
          { value: "poor", label: "Poor — needs prep/repairs" },
        ],
      },
    ],
    calculate(inputs) {
      const area = asNumber(inputs.area_sqm);
      let min = area * 20;
      let max = area * 45;
      const breakdown = [
        `${area}m² × ${formatNzd(20)}-${formatNzd(45)}/m² labour = ${formatNzd(min)}-${formatNzd(max)}`,
      ];
      // No sourced interior/exterior split — this is a reasonable surcharge
      // layered on top of the single sourced per-sqm range, not itself a
      // sourced figure.
      if (asString(inputs.scope) === "exterior") {
        min *= 1.15;
        max *= 1.15;
        breakdown.push("Exterior work: +15%");
      }
      if (asString(inputs.surface_condition) === "poor") {
        min *= 1.2;
        max *= 1.2;
        breakdown.push("Extra prep for poor surface condition: +20%");
      }
      return { min, max, breakdown };
    },
  },

  // ---------------------------------------------------------------
  // Interior systems
  // ---------------------------------------------------------------
  {
    slug: "insulation",
    name: "Insulation",
    category: "Interior systems",
    description: "Ceiling and underfloor insulation.",
    fields: [
      {
        type: "select",
        key: "scope",
        label: "Scope",
        defaultValue: "ceiling",
        options: [
          { value: "ceiling", label: "Ceiling only (small home)" },
          { value: "ceiling_underfloor", label: "Ceiling + underfloor" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        ceiling: [1200, 3000],
        ceiling_underfloor: [3500, 5500],
      };
      const [min, max] = buckets[asString(inputs.scope)] ?? buckets.ceiling;
      return {
        min,
        max,
        breakdown: [`Typical range for this scope: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "heating_ventilation",
    name: "Heating & ventilation",
    category: "Interior systems",
    description: "Heat pump and ventilation system installs.",
    fields: [
      {
        type: "select",
        key: "system_size",
        label: "System size",
        defaultValue: "single",
        options: [
          { value: "single", label: "Single heat pump / unit" },
          { value: "multi", label: "Multi-split, 2-3 units" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        single: [2300, 2700],
        multi: [5500, 6500],
      };
      const [min, max] = buckets[asString(inputs.system_size)] ?? buckets.single;
      return {
        min,
        max,
        breakdown: [`Typical range for this system size: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },
  {
    slug: "lighting",
    name: "Lighting installation",
    category: "Interior systems",
    description: "New light fitting installation.",
    fields: [
      {
        type: "select",
        key: "job_size",
        label: "Job size",
        defaultValue: "small",
        options: [
          { value: "small", label: "5-10 lights" },
          { value: "full_home", label: "20-30 lights, full home" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        small: [690, 1200],
        full_home: [2800, 4000],
      };
      const [min, max] = buckets[asString(inputs.job_size)] ?? buckets.small;
      return {
        min,
        max,
        breakdown: [`Typical range for this job size: ${formatNzd(min)}-${formatNzd(max)}`],
      };
    },
  },

  // ---------------------------------------------------------------
  // Specialist
  // ---------------------------------------------------------------
  {
    slug: "asbestos_removal",
    name: "Asbestos removal",
    category: "Specialist",
    description: "Licensed asbestos removal.",
    fields: [
      {
        type: "select",
        key: "area_size",
        label: "Area affected",
        defaultValue: "small",
        options: [
          { value: "small", label: "Small area (e.g. single room / garage)" },
          { value: "medium", label: "Medium area (e.g. full roof / exterior cladding)" },
        ],
      },
    ],
    calculate(inputs) {
      const buckets: Record<string, [number, number]> = {
        small: [1500, 3000],
        medium: [6000, 12000],
      };
      const [min, max] = buckets[asString(inputs.area_size)] ?? buckets.small;
      return {
        min,
        max,
        breakdown: [`Typical range for this area: ${formatNzd(min)}-${formatNzd(max)}`],
        note: "Asbestos removal is legally regulated in NZ — always use a licensed asbestos removalist (WorkSafe requirements apply above certain thresholds).",
      };
    },
  },
];

export const ESTIMATORS: Record<string, EstimatorConfig> = Object.fromEntries(
  ESTIMATOR_LIST.map((config) => [config.slug, config])
);

export const ESTIMATOR_CATEGORY_ORDER: EstimatorCategory[] = [
  "Outdoor & structural",
  "Exterior",
  "Renovations",
  "Interior systems",
  "Specialist",
];

export function getEstimatorsByCategory(): { category: EstimatorCategory; estimators: EstimatorConfig[] }[] {
  return ESTIMATOR_CATEGORY_ORDER.map((category) => ({
    category,
    estimators: ESTIMATOR_LIST.filter((config) => config.category === category),
  }));
}
