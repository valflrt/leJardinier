import CCommand from "../../../../features/commands/classes/command";

import formatters from "../../../../builders/replyFormatters";

import commandList from "../../..";

const command_cmd = new CCommand()
  .setName("command")
  .addAlias("cmd")
  .setDescription("Get help about one command")
  .addParameter((p) => p.setName("command name").setRequired(true))
  .setExecution(async ({ message, commandParameters }) => {
    if (!commandParameters)
      return message.sendTextEmbed(
        `You need to specify the name of the command you're looking for...`
      );

    let command = commandList.find(commandParameters.split(/\./g));

    if (!command) return message.sendTextEmbed(`Unknown command...`);
    else {
      message.sendCustomEmbed((embed) =>
        embed
          .setDescription(new formatters.CommandPreview(command!).fullPreview)
          .addFields(formatters.CommandPreview.createFields(command!.commands))
      );
    }
  })
  .addHelpCommand();

export default command_cmd;
