/** All V1 matching weights live here so calibration is reviewable. */
export const MATCHING_CONFIG = {
  destiny: { lifestyle: 0.55, career: 0.15, cost: 0.10, climate: 0.10, space: 0.10 },
  career: { AMB: 0.34, NOV: 0.24, SOC: 0.18, ORDER: 0.24 },
  comfort: { PACE: 0.25, NAT: 0.20, FOOD: 0.18, SPACE: 0.20, COST: 0.17 },
  priceCny: 9.9,
  reportPromptVersion: "2026.08.v1"
} as const;
