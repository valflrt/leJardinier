import { EmbedFieldData } from "discord.js";
import { bold } from "@discordjs/builders";

import Command from "../commands/command";

/**
 * Creates formatted embed fields for an array of commands
 * @param commands Commands to use to make the fields
 */
export const createEmbedFields = (commands: Command[]): EmbedFieldData[] => {
  return commands
    .filter((c) => !c.settings.hidden)
    .map((command): EmbedFieldData => {
      return {
        name: bold(command.name),
        value: command.formattedDescription,
      };
    });
};
