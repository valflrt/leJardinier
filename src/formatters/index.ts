import { EmbedFieldData } from "discord.js";
import { bold, inlineCode, quote, underscore } from "@discordjs/builders";

import CCommand from "../managers/commands/classes/command";

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

export class CommandPreview {
  public name: string;
  public description: string;
  public fullPreview: string;

  constructor(command: CCommand) {
    this.name = `${bold(command.name)}`;
    this.description = quote(`${command.description}\n`)
      .concat(quote(`Usage: ${bold(inlineCode(command.syntax!))}`))
      .concat(
        command.aliases.length !== 0
          ? `\n${quote(
              `Alias${command.aliases.length > 1 ? "es" : ""}: ${command.aliases
                .map((a) => bold(inlineCode(a)))
                .join(" ")}`
            )}`
          : ""
      );
    this.fullPreview = `${bold(this.name)}\n`
      .concat(this.description)
      .concat(
        command.commandCount !== 0
          ? `\n\n${bold(underscore(`Subcommands:`))}\n`
          : ""
      );
  }

  public static createFields(commands: CCommand[]): EmbedFieldData[] {
    return commands
      .filter((c) => !c.settings.hidden)
      .map((command): EmbedFieldData => {
        let preview = new CommandPreview(command);
        return { name: preview.name, value: preview.description };
      });
  }
}
