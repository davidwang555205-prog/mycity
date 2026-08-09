import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { CITIES } from "@/data/cities";
import { DIMENSIONS } from "@/domain/types";
import { matchCities, sampleQuestions, scoreProfile } from "./engine";
describe("controlled sampler", () => {
 it("returns 28 stable questions, all anchors and minimum dimension coverage", () => { const one=sampleQuestions(QUESTIONS,"session-a"), two=sampleQuestions(QUESTIONS,"session-a"); expect(one).toHaveLength(28); expect(one.map(q=>q.id)).toEqual(two.map(q=>q.id)); expect(new Set(one.map(q=>q.id)).size).toBe(28); expect(one.filter(q=>q.anchor)).toHaveLength(12); for(const d of DIMENSIONS) expect(one.filter(q=>q.primaryDimension===d).length).toBeGreaterThanOrEqual(2); expect(new Set(one.map(q=>q.semanticGroup)).size).toBe(28); });
 it("varies across sessions", () => expect(sampleQuestions(QUESTIONS,"session-a").map(q=>q.id)).not.toEqual(sampleQuestions(QUESTIONS,"session-b").map(q=>q.id)));
});
describe("profile and matching", () => { const questions=sampleQuestions(QUESTIONS,"scoring"); const answers=Object.fromEntries(questions.map(q=>[q.id,q.options[0].id])); const profile=scoreProfile(questions,answers); it("normalizes every score",()=>{ for(const d of DIMENSIONS) expect(profile[d]).toBeGreaterThanOrEqual(0); for(const d of DIMENSIONS) expect(profile[d]).toBeLessThanOrEqual(100); }); it("rejects missing answers",()=>expect(()=>scoreProfile(questions,{})).toThrow()); it("ranks all cities deterministically",()=>{ const a=matchCities(profile),b=matchCities(profile); expect(a.destiny).toHaveLength(CITIES.length); expect(a.destiny.map(x=>x.city.id)).toEqual(b.destiny.map(x=>x.city.id)); expect(a.destiny.every(x=>Number.isFinite(x.score))).toBe(true); }); });
describe("city calibration contract",()=>{ it("keeps all source types and confidence values explicit",()=>{expect(CITIES).toHaveLength(30);for(const city of CITIES){expect(city.sources).toHaveLength(12);for(const d of DIMENSIONS){expect(city.confidence[d]).toBeGreaterThan(0);expect(city.confidence[d]).toBeLessThanOrEqual(1);}}}); });
