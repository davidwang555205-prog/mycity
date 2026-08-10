import { describe, expect, it } from "vitest";
import { QUESTIONS } from "./questions";

describe("question answer wording", () => {
  it("gives every question a distinct set of contextual answer text", () => {
    expect(QUESTIONS).toHaveLength(96);
    for (const question of QUESTIONS) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options.map((option) => option.text)).size).toBe(4);
    }

    const texts = QUESTIONS.flatMap((question) => question.options.map((option) => option.text));
    expect(new Set(texts).size).toBe(384);
  });
});
