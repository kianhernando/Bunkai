import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenize";
import { groupTokens } from "./group";

describe("groupTokens", () => {
  it("groups a polite past verb into one word", async () => {
    const words = groupTokens(await tokenize("私は寿司を食べました。"));
    expect(words.map((w) => w.text)).toEqual(["私", "は", "寿司", "を", "食べました", "。"]);
  });

  it("groups te-form plus helper verb into one word", async () => {
    const words = groupTokens(await tokenize("寿司を食べている"));
    expect(words.map((w) => w.text)).toEqual(["寿司", "を", "食べている"]);
  });

  it("groups past copula without attaching it to the noun", async () => {
    const words = groupTokens(await tokenize("学生でした"));
    expect(words.map((w) => w.text)).toEqual(["学生", "でした"]);
  });

  it("groups a negative verb into one word", async () => {
    const words = groupTokens(await tokenize("食べない"));
    expect(words.map((w) => w.text)).toEqual(["食べない"]);
  });

  it("keeps the dictionary form of a grouped verb", async () => {
    const words = groupTokens(await tokenize("食べている"));
    expect(words).toHaveLength(1);
    expect(words[0].base).toBe("食べる");
  });
});