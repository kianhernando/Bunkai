import type kuromoji from "kuromoji";
import { toHiragana } from "./reading";
import type { Word } from "./types";

function attachesToPrevious(token: kuromoji.IpadicFeatures, previous: Word | undefined): boolean {
  if (!previous) return false;

  const previousIsVerbLike = previous.pos === "動詞" || previous.pos === "形容詞";

  // Rule 1: auxiliary endings (ます, た, ない, たい) attach to verbs, adjectives,
  // and other auxiliaries, so でし + た becomes でした
  if (token.pos === "助動詞") {
    return previousIsVerbLike || previous.pos === "助動詞";
  }

  // Rule 2: the て/で that links a verb to what comes next (食べて)
  const isTeForm =
    token.pos === "助詞" &&
    token.pos_detail_1 === "接続助詞" &&
    (token.surface_form === "て" || token.surface_form === "で");
  if (isTeForm) {
    return previousIsVerbLike;
  }

  // Rule 3: helper verbs like いる in 食べている or しまう in 食べてしまう
  if (token.pos === "動詞" && token.pos_detail_1 === "非自立") {
    return previousIsVerbLike;
  }

  return false;
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