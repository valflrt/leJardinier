import { codeBlock } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import Morse from "../../../../features/morse";

const encode_cmd = new CCommand()
  .setName("encode")
  .setDescription("Encodes text to Morse code")
  .addParameter((p) => p.setName("sentence").setRequired(true))
  .setExecution(async ({ message, commandParameters }) => {
    if (commandParameters.length === 0)
      message.sendTextEmbed(
        "You need to give some text to convert to Morse Code..."
      );
    else
      message.sendTextEmbed(
        "Here is your Morse encoded text:".concat(
          codeBlock(Morse.encode(commandParameters))
        )
      );
  })
  .addHelpCommand();

export default encode_cmd;
