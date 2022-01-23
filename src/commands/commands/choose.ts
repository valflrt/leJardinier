import { inlineCode } from "@discordjs/builders";

import CCommand from "../../features/commands/classes/command";

import { randomItem } from "../../utils";

const choose_cmd = new CCommand()
  .setName("choose")
  .setDescription("Chooses one of the items specified")
  .setExecution(async ({ message, commandParameters }) => {
    let items = commandParameters.split(/\s*\|\s*/g);
    let item = randomItem(...items);
    message.sendTextEmbed(
      `I choose: ${
        item.search(/\<.+[0123456789]{18}\>/g) === -1 ? inlineCode(item) : item
      }`
    );
  })
  .addHelpCommand();

export default choose_cmd;
