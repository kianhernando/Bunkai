import { NextResponse } from "next/server";
import { tokenize } from "@/lib/analysis/tokenize";

export async function POST(request: Request) {
    const { text } = await request.json();
    const tokens = await tokenize(text);
    console.log(tokens);
    const words = tokens.map((t) => t.surface_form);
    return NextResponse.json({ words });
}