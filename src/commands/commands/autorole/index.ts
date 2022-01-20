import CCommand from "../../../features/commands/classes/command";

// subcommands imports
import set_cmd from "./subcommands/set";
import remove_cmd from "./subcommands/remove";

const autorole__cmd = new CCommand()
  .setName("autorole")
  .setDescription("Autorole command")
  .setExecution((messageInstance) => {
    let { methods } = messageInstance;

    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription("Here are the commands to use:")
        .addFields(
          methods.formatters.CommandPreview.createFields(autorole_cmd.commands)
        )
    );
  })

  .addSubcommand((c) => set_cmd)
  // remove
  .addSubcommand((c) => remove_cmd);

export default autorole_cmd;
