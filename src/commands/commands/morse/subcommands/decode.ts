import { codeBlock } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import Morse from "../../../../features/morse";

const decode_cmd = new CCommand()
  .setName("decode")
  .setDescription("Decodes Morse code")
  .addParameter((p) => p.setName("morse code").setRequired(true))
  .setExecution(async ({ message, commandParameters }) => {
    if (commandParameters.length === 0)
      message.sendTextEmbed("You need to give some Morse to decode...");
    else
      message.sendTextEmbed(
        "Here is your decoded text:".concat(
          codeBlock(Morse.decode(commandParameters))
        )
      );
  })
  .addHelpCommand();

export default decode_cmd;
