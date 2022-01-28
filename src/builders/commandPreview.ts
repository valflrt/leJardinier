import { EmbedFieldData } from "discord.js";
import { bold, inlineCode, quote, underscore } from "@discordjs/builders";

import Command from "../features/commands/classes/command";

export default class CommandPreview {
  private command: Command;

  constructor(command: Command) {
    this.command = command;
  }

  /**
   * Formatted command name
   */
  public get name(): string {
    return `${bold(this.command.name)}`;
  }

  /**
   * Formatted command description
   */
  public get description(): string {
    return `${this.command.description}\n`
      .concat(`Usage: ${bold(inlineCode(this.command.syntax!))}`)
      .concat(
        this.command.aliases.length !== 0
          ? `\n${`Alias${
              this.command.aliases.length > 1 ? "es" : ""
            }: ${this.command.aliases
              .map((a) => bold(inlineCode(a)))
              .join(" ")}`}`
          : ""
      )
      .split(/\n/g)
      .map((line) => quote(line))
      .join("\n");
  }

  /**
   * Formatted embed fields for the command's subcommands
   */
  public get embedFields(): EmbedFieldData[] {
    return this.command.commands
      .filter((c) => !c.settings.hidden)
      .map((command): EmbedFieldData => {
        let preview = new CommandPreview(command);
        return { name: preview.name, value: preview.description };
      });
  }

  /**
   * Creates a formatted preview for the current command
   * @param subcommandsIndicator if set to true, adds an header to indicate that there are subcommands. Default is true.
   */
  public getFullPreview(subcommandsIndicator: boolean = true): string {
    return `${bold(this.name)}\n`
      .concat(this.description)
      .concat(
        subcommandsIndicator && this.command.commandCount !== 0
          ? `\n\n${bold(underscore(`Subcommands:`))}\n`
          : ""
      );
  }

  /**
   * Creates formatted embed fields for an array of commands
   * @param commands Commands to use to make the fields
   */
  public static createFields(commands: Command[]): EmbedFieldData[] {
    return commands
      .filter((c) => !c.settings.hidden)
      .map((command): EmbedFieldData => {
        let preview = new CommandPreview(command);
        return { name: preview.name, value: preview.description };
      });
  }
}
