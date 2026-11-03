import { NextResponse } from "next/server";
import { tokenize } from "@/lib/analysis/tokenize";
import { groupTokens } from "@/lib/analysis/group";
import { lookup } from "@/lib/dictionary/lookup";

export async function POST(request: Request) {
  const { text } = await request.json();
  const tokens = await tokenize(text);

  const words = groupTokens(tokens).map((word) => {
    const base = word.base === "*" ? word.text : word.base;
    const entry = lookup(base, word.reading, word.pos);
    const meaning = entry ? JSON.parse(entry.glosses).join(", ") : undefined;
    return { ...word, base, meaning };
  });

  return NextResponse.json({ words });
}