export const UNITS = {
  HECTARE: 'hectare',
  ARE: 'are',
  SQM: 'sqm',
} as const;

const SQM_CONVERSIONS = {
  vigha: 1618.74257,
  guntha: 101.17141056,
  acre: 4046.85642,
  sqft_per_sqm: 10.7639,
  hectare: 10000,
  are: 100,
};

export type ConversionInputUnit = typeof UNITS[keyof typeof UNITS];

export interface ConversionInput {
  value: number;
  unit: ConversionInputUnit;
}

export interface ConversionResult {
  vigha: number;
  guntha: number;
  acre: number;
  sqm: number;
  hectare: number;
  are: number;
  sqft: number;
}

export function convertArea(input: ConversionInput): ConversionResult {
  let valueInSqm: number;

  switch (input.unit) {
    case UNITS.HECTARE:
      valueInSqm = input.value * SQM_CONVERSIONS.hectare;
      break;
    case UNITS.ARE:
      valueInSqm = input.value * SQM_CONVERSIONS.are;
      break;
    case UNITS.SQM:
      valueInSqm = input.value;
      break;
    default:
      valueInSqm = 0;
  }

  if (isNaN(valueInSqm) || valueInSqm < 0) {
    valueInSqm = 0;
  }

  return {
    vigha: valueInSqm / SQM_CONVERSIONS.vigha,
    guntha: valueInSqm / SQM_CONVERSIONS.guntha,
    acre: valueInSqm / SQM_CONVERSIONS.acre,
    sqft: valueInSqm * SQM_CONVERSIONS.sqft_per_sqm,
    hectare: valueInSqm / SQM_CONVERSIONS.hectare,
    are: valueInSqm / SQM_CONVERSIONS.are,
    sqm: valueInSqm,
  };
}
