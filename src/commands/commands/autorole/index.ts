import Command from "../../../features/commands/command";

// subcommands imports
import add_cmd from "./subcommands/add";
import remove_cmd from "./subcommands/remove";

const autorole_cmd = new Command({
  name: "autorole",
  description: "Autorole command",
  execution:
    (cmd) =>
    async ({ actions }) => {
      actions.sendCustomEmbed((embed) =>
        embed
          .setDescription(
            `This command allows you to create a button `
              .concat(`which gives a specific role when clicked.\n\n`)
              .concat(`Here are commands you can use:`)
          )
          .addFields(cmd.preview.embedFields)
      );
    },
  commands: () => [add_cmd, remove_cmd],
});

export default autorole_cmd;
