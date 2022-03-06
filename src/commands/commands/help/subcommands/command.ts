import Command from "../../../../features/commands/command";

import commandList from "../../..";

const command_cmd = new Command({
  name: "command",
  description: "Get help about one command",
  aliases: ["cmd"],
  parameters: [{ name: "command name", required: true }],
  execution:
    (cmd) =>
    async ({ actions, attributes }) => {
      if (!attributes.parameters)
        return actions.sendTextEmbed(
          `You need to specify the name of the command you're looking for...`
        );

      let command = commandList.find(attributes.parameters.split(/\./g));

      if (!command) return actions.sendTextEmbed(`Unknown command...`);
      else {
        actions.sendCustomEmbed((embed) =>
          embed
            .setDescription(cmd.preview.getFullPreview())
            .addFields(cmd.preview.embedFields)
        );
      }
    },
});

export default command_cmd;
