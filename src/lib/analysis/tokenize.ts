import kuromoji from "kuromoji";
import path from "path";

let tokenizerPromise: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> | null = null;

function getTokenizer() {
    if (!tokenizerPromise) {
        tokenizerPromise = new Promise((resolve, reject) => {
            kuromoji
                .builder({ dicPath: path.join(process.cwd(), "node_modules/kuromoji/dict") })
                .build((err, tokenizer) => {
                    if (err) reject(err);
                    else resolve(tokenizer);
                });
        });
    }
    return tokenizerPromise;
}

export async function tokenize(text: string) {
    const tokenizer = await getTokenizer();
    return tokenizer.tokenize(text);
}