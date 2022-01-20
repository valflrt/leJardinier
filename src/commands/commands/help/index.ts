import { bold, italic } from "@discordjs/builders";

import CCommand from "../../../features/commands/classes/command";

import reactions from "../../../assets/reactions";

// subcommands imports
import usage_cmd from "./subcommands/usage";
import commands_cmd from "./subcommands/commands";
import command_cmd from "./subcommands/command";
import website_cmd from "./subcommands/website";

const help__cmd = new CCommand()
  .setName("help")
  .setDescription("Display help panel")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `Hello I'm ${bold("Le Jardinier")} ${reactions.smile.random}\n`
            .concat(
              `I am an utility discord bot developed by <@${
                "564012236851511298" /* my discord id */
              }>.\n`
            )
            .concat(italic(`"le jardinier" means "the gardener" in french.\n`))
            .concat("\n")
            .concat(`Here are some commands you can start with:`)
        )
        .addFields(
          methods.formatters.CommandPreview.createFields(help_cmd.commands)
        )
    );
  })

  .addSubcommand(() => usage_cmd)
  .addSubcommand(() => commands_cmd)
  .addSubcommand(() => command_cmd)
  .addSubcommand(() => website_cmd);

export default help_cmd;
