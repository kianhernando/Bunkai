export function toHiragana(text: string): string {
    return text
        .split("")
        .map((char) => {
            const code = char.charCodeAt(0);

            if (code >= 0x30a1 && code <= 0x30f6) {
                return String.fromCharCode(code - 0x60);
            }

            return char;
        })
        .join("");
}
