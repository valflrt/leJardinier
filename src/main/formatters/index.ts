import morseTable from "../assets/morseTable";

class MorseFormatter {
  // encode
  public encode(text: string): string {
    return text
      .split(/\s+/g)
      .map((w) => this.encodeLoop(w))
      .join(" / ")
      .toLowerCase();
  }
  private encodeLoop(text: string, encoded: string[] = []): string {
    if (text.length === 0) return encoded.join(" ");

    let char = text[0];

    let tableItem = morseTable.find((item) => char.search(item[0]) !== -1);
    let morseLetter = !tableItem ? "#" : tableItem[1];

    encoded.push(morseLetter);

    return this.encodeLoop(text.slice(1), encoded);
  }

  // decode
  public decode(text: string): string {
    return text
      .split(/\s\/\s/g)
      .map((w) => this.decodeLoop(w.split(/\s/g)))
      .join(" ")
      .toLowerCase()
      .trim();
  }
  private decodeLoop(chars: string[], decoded: string[] = []): string {
    if (chars.length === 0) return decoded.join("");

    let char = chars[0];

    let tableItem = morseTable.find((item) => item[1] === char);
    let letter = !tableItem ? "#" : tableItem[2];

    decoded.push(letter);

    return this.decodeLoop(chars.slice(1), decoded);
  }
}

export const morseFormatter = new MorseFormatter();
