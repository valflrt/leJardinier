import { inlineCode } from "@discordjs/builders";

import CCommand from "../../features/commands/classes/command";

const reverse_cmd = new CCommand()
  .setName("reverse")
  .setDescription("Reverses the specified text")
  .setExecution(async ({ message, commandParameters }) => {
    const reverseText = (v: string): string[] =>
      v.length === 0 ? [] : reverseText(v.slice(1)).concat(v[0]);

    message.sendTextEmbed(
      `Here is you reversed text:\n`.concat(
        inlineCode(reverseText(commandParameters).join(""))
      )
    );
  })
  .addHelpCommand();

export default reverse_cmd;
