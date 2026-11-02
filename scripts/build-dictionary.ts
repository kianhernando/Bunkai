// Builds data/dictionary.sqlite from the jmdict-eng-common JSON in data/.
// Run with `npm run build:dict`.

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DATA_DIR = path.join(import.meta.dirname, "..", "data");
const OUTPUT_PATH = path.join(DATA_DIR, "dictionary.sqlite");
const MAX_GLOSSES = 3;

// Only the parts of the jmdict-simplified format this script reads.
interface JMdictKanji {
    text: string;
    common: boolean;
}

interface JMdictKana {
    text: string;
    common: boolean;
    // ["*"] = applies to every kanji form, [] = this reading has no kanji.
    appliesToKanji: string[];
}

interface JMdictSense {
    partOfSpeech: string[];
    appliesToKanji: string[];
    appliesToKana: string[];
    gloss: { text: string }[];
}

interface JMdictWord {
    id: string;
    kanji: JMdictKanji[];
    kana: JMdictKana[];
    sense: JMdictSense[];
}

interface JMdictFile {
    version: string;
    words: JMdictWord[];
}

interface Row {
    entryId: number;
    written: string;
    reading: string;
    common: number;
    pos: string;
    glosses: string;
}

function findSourceFile(): string {
    const matches = fs
        .readdirSync(DATA_DIR)
        .filter((name) => /^jmdict-eng-common-.*\.json$/.test(name));

    if (matches.length !== 1) {
        throw new Error(
            `Expected exactly one jmdict-eng-common-*.json in ${DATA_DIR}, found ${matches.length}`,
        );
    }

    return path.join(DATA_DIR, matches[0]);
}

function appliesTo(restrictions: string[], form: string): boolean {
    return restrictions.includes("*") || restrictions.includes(form);
}

// Senses can be restricted to particular spellings or readings, so each
// (written, reading) pair only gets the senses that are valid for it.
function buildRow(
    word: JMdictWord,
    written: string,
    reading: string,
    common: boolean,
    kanji: string | null,
): Row | null {
    const senses = word.sense.filter(
        (sense) =>
            appliesTo(sense.appliesToKana, reading) &&
            (kanji === null || appliesTo(sense.appliesToKanji, kanji)),
    );

    if (senses.length === 0) {
        return null;
    }

    const glosses = senses
        .flatMap((sense) => sense.gloss.map((gloss) => gloss.text))
        .slice(0, MAX_GLOSSES);

    return {
        entryId: Number(word.id),
        written,
        reading,
        common: common ? 1 : 0,
        pos: JSON.stringify(senses[0].partOfSpeech),
        glosses: JSON.stringify(glosses),
    };
}

function rowsForWord(word: JMdictWord): Row[] {
    const rows: (Row | null)[] = [];

    // Kanji spellings, paired with each reading that's valid for them.
    for (const kanji of word.kanji) {
        for (const kana of word.kana) {
            if (appliesTo(kana.appliesToKanji, kanji.text)) {
                rows.push(
                    buildRow(word, kanji.text, kana.text, kanji.common && kana.common, kanji.text),
                );
            }
        }
    }

    // Every reading as its own spelling, so words written in kana
    // (わかる, ください) can be found too.
    for (const kana of word.kana) {
        rows.push(buildRow(word, kana.text, kana.text, kana.common, null));
    }

    return rows.filter((row): row is Row => row !== null);
}

function main(): void {
    const sourcePath = findSourceFile();
    console.log(`Reading ${path.basename(sourcePath)}`);
    const jmdict = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as JMdictFile;

    // Build into a temp file and rename at the end, so a failed run
    // never leaves a half-written dictionary behind.
    const tempPath = `${OUTPUT_PATH}.tmp`;
    fs.rmSync(tempPath, { force: true });
    const db = new Database(tempPath);

    db.exec(`
        CREATE TABLE entries (
            id       INTEGER PRIMARY KEY,
            entry_id INTEGER NOT NULL,
            written  TEXT    NOT NULL,
            reading  TEXT    NOT NULL,
            common   INTEGER NOT NULL,
            pos      TEXT    NOT NULL,
            glosses  TEXT    NOT NULL
        );
    `);

    const insert = db.prepare(`
        INSERT INTO entries (entry_id, written, reading, common, pos, glosses)
        VALUES (@entryId, @written, @reading, @common, @pos, @glosses)
    `);

    // One transaction for all inserts: much faster than committing each row.
    const insertAll = db.transaction((words: JMdictWord[]) => {
        let count = 0;
        for (const word of words) {
            for (const row of rowsForWord(word)) {
                insert.run(row);
                count++;
            }
        }
        return count;
    });

    const count = insertAll(jmdict.words);

    // Created after the inserts, which is faster than updating it per row.
    db.exec("CREATE INDEX idx_entries_written ON entries (written);");
    db.close();

    fs.renameSync(tempPath, OUTPUT_PATH);
    console.log(
        `Wrote ${count} rows from ${jmdict.words.length} entries (JMdict ${jmdict.version}) to ${OUTPUT_PATH}`,
    );
}

main();
