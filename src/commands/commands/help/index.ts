import { bold, italic } from "@discordjs/builders";

import CCommand from "../../../managers/commands/classes/command";

import reactions from "../../../assets/reactions";

// subcommands imports
import usage from "./subcommands/usage";
import commands from "./subcommands/commands";
import command from "./subcommands/command";
import website from "./subcommands/website";

const help = new CCommand()
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
          methods.formatters.CommandPreview.createFields(help.commands)
        )
    );
  })

  .addSubcommand(() => usage)
  .addSubcommand(() => commands)
  .addSubcommand(() => command)
  .addSubcommand(() => website);

export default help;
