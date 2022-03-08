import { MessageActionRow, MessageButton } from "discord.js";

import { bold, italic } from "@discordjs/builders";

import Command from "../../../features/commands/command";

import reactions from "../../../assets/reactions";

// subcommands imports
import usage_cmd from "./subcommands/usage";
import commands_cmd from "./subcommands/commands";
import command_cmd from "./subcommands/command";

const help_cmd = new Command({
  name: "help",
  description: "Display help panel",
  execution:
    (cmd) =>
    async ({ actions }) => {
      actions.sendCustomEmbed(
        (embed) =>
          embed
            .setDescription(
              `Hello I'm ${bold("Le Jardinier")} ${reactions.smile.random}\n`
                .concat(
                  `I am an utility discord bot developed by <@${
                    "564012236851511298" /* my discord id */
                  }>.\n`
                )
                .concat(
                  italic(`"le jardinier" means "the gardener" in french.\n`)
                )
                .concat("\n")
                .concat(`Here are some commands you can start with:`)
            )
            .addFields(cmd.formattedEmbedFields),
        {
          components: [
            new MessageActionRow().setComponents([
              new MessageButton()
                .setLabel("Website")
                .setURL(`https://valflrt.github.io/lejardinier/`)
                .setStyle("LINK"),
              new MessageButton()
                .setLabel("Developer")
                .setURL(`https://github.com/valflrt`)
                .setStyle("LINK"),
            ]),
          ],
        }
      );
    },
  commands: () => [usage_cmd, commands_cmd, command_cmd],
});

export default help_cmd;
