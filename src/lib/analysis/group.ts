import type kuromoji from "kuromoji";
import { toHiragana } from "./reading";
import type { Word } from "./types";

function attachesToPrevious(token: kuromoji.IpadicFeatures, previous: Word | undefined): boolean {
  if (!previous) return false;
  const canTakeEndings = previous.pos === "動詞" || previous.pos === "形容詞";
  return canTakeEndings && token.pos === "助動詞";
}

export function groupTokens(tokens: kuromoji.IpadicFeatures[]): Word[] {
  const words: Word[] = [];

  for (const token of tokens) {
    const reading = toHiragana(token.reading ?? token.surface_form);
    const previous = words[words.length - 1];

    if (attachesToPrevious(token, previous)) {
      previous.text += token.surface_form;
      previous.reading += reading;
    } else {
      words.push({
        text: token.surface_form,
        reading,
        pos: token.pos,
        base: token.basic_form,
      });
    }
  }

  return words;
}