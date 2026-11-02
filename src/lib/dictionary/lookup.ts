import Database from "better-sqlite3";
import path from "path";
import type { DictionaryRow } from "@/lib/analysis/types";

const db = new Database(path.join(process.cwd(), "data/dictionary.sqlite"), {
  readonly: true,
});

const findByWritten = db.prepare("SELECT * FROM entries WHERE written = ?");

export function lookup(base: string, reading: string, pos: string): DictionaryRow | undefined {
  const rows = findByWritten.all(base) as DictionaryRow[];

  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];

  const readingMatches = rows.filter((row) => row.reading === reading);
  if (readingMatches.length === 1) return readingMatches[0];

  const candidates = readingMatches.length > 0 ? readingMatches : rows;

  if (pos === "助詞") {
    const prtMatch = candidates.find((row) => JSON.parse(row.pos).includes("prt"));
    if (prtMatch) return prtMatch;
  }

  return candidates[0];
}