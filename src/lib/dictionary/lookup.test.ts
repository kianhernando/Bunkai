import { describe, it, expect } from "vitest";
import { lookup } from "./lookup";

describe("lookup", () => {
  it("picks the reading that matches", () => {
    expect(lookup("私", "わたし", "名詞")?.reading).toBe("わたし");
  });

  it("picks the particle meaning of は", () => {
    const row = lookup("は", "は", "助詞");
    expect(JSON.parse(row!.glosses)[0]).toBe("indicates sentence topic");
  });

  it("returns undefined for unknown words", () => {
    expect(lookup("ぴよぴよぴよ", "ぴよぴよぴよ", "名詞")).toBeUndefined();
  });
});