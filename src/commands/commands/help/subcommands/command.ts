import CCommand from "../../../../managers/commands/classes/command";

import commandList from "../../..";

const command = new CCommand()
  .setName("command")
  .addAlias("cmd")
  .setDescription("Get help about one command")
  .addParameter((p) => p.setName("command name").setRequired(true))
  .setExecution(async (messageInstance) => {
    let { methods, commandParameters } = messageInstance;

    if (!commandParameters)
      return methods.sendTextEmbed(
        `You need to specify the name of the command you're looking for...`
      );

    let command = commandList.find(commandParameters.split(/\./g));

    if (!command) return methods.sendTextEmbed(`Unknown command...`);
    else {
      methods.sendCustomEmbed((embed) =>
        embed
          .setDescription(
            new methods.formatters.CommandPreview(command!).fullPreview
          )
          .addFields(
            methods.formatters.CommandPreview.createFields(command!.commands)
          )
      );
    }
  })
  .addHelpCommand();

export default command;
