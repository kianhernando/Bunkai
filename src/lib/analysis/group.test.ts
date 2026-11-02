import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenize";
import { groupTokens } from "./group";

describe("groupTokens", () => {
  it("groups a polite past verb into one word", async () => {
    const words = groupTokens(await tokenize("私は寿司を食べました。"));
    expect(words.map((w) => w.text)).toEqual(["私", "は", "寿司", "を", "食べました", "。"]);
  });
});