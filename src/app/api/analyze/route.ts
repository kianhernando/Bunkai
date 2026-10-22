import { NextResponse } from "next/server";
import { tokenize } from "@/lib/analysis/tokenize";
import { toHiragana } from "@/lib/analysis/reading";
import type { Word } from "@/lib/analysis/types";

export async function POST(request: Request) {
    const { text } = await request.json();
    const tokens = await tokenize(text);
    console.log(tokens);
    const words: Word[] = tokens.map((t) => ({
        text: t.surface_form,
        reading: toHiragana(t.reading ?? t.surface_form),
    }));
    return NextResponse.json({ words });
}