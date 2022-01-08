import { bold, inlineCode, quote, underscore } from "@discordjs/builders";
import { EmbedFieldData } from "discord.js";
import CCommand from "../managers/commands/classes/command";

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

const formatters = {
  CommandPreview,
};

export default formatters;
