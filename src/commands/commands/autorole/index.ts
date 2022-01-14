import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";

import database from "../../managers/database";
import reactions from "../../assets/reactions";

// subcommands imports
import set from "./subcommands/set";
import remove from "./subcommands/remove";

const autorole = new CCommand()
  .setName("autorole")
  .setDescription("Autorole command")
  .setExecution((messageInstance) => {
    let { methods } = messageInstance;

    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription("Here are the commands to use:")
        .addFields(
          methods.formatters.CommandPreview.createFields(autorole.commands)
        )
    );
  })

  .addSubcommand((c) => set)
  // remove
  .addSubcommand((c) => remove);

export default autorole;
