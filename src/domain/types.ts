export const DIMENSIONS = ["AMB", "PACE", "SOC", "NAT", "COST", "ORDER", "CULT", "FOOD", "CLIM", "SPACE", "NOV", "ROOT"] as const;
export type LifeDimension = (typeof DIMENSIONS)[number];
export type ClimateKey = "warm" | "cool" | "dry" | "humid" | "sunny";
export type Effects = Partial<Record<LifeDimension, number>>;
export interface QuestionOption { id: string; text: string; effects: Effects; climateEffects?: Partial<Record<ClimateKey, number>> }
export interface Question { id: string; version: number; active: boolean; primaryDimension: LifeDimension; anchor: boolean; scenario: string; semanticGroup: string; text: string; options: QuestionOption[] }
export interface ClimatePreference { warm: number; cool: number; dry: number; humid: number; sunny: number }
export type LifeProfile = Record<LifeDimension, number> & { climate: ClimatePreference };
export type CityMetricSourceType = "objective" | "derived" | "editorial";
export interface CityMetricSource { dimension: LifeDimension | "climate"; type: CityMetricSourceType; note: string; sourceName?: string; sourceUrl?: string; sourceYear?: number }
export interface CityProfile { id: string; name: string; dimensions: Record<Exclude<LifeDimension, "COST">, number>; actualCostLevel: number; climate: ClimatePreference; tags: string[]; strengths: string[]; tradeoffs: string[]; sources: CityMetricSource[]; confidence: Record<LifeDimension, number> }
export interface CityResult { city: CityProfile; score: number; factors: string[] }
