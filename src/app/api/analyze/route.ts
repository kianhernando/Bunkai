import { NextResponse } from "next/server";
import { tokenize } from "@/lib/analysis/tokenize";
import { groupTokens } from "@/lib/analysis/group";

export async function POST(request: Request) {
  const { text } = await request.json();
  const tokens = await tokenize(text);
  console.log(tokens);
  const words = groupTokens(tokens);
  return NextResponse.json({ words });
}