import { bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../../features/commands/classes/command";
import * as utils from "../../utils";

const boolean = new CCommand()
  .setName("boolean")
  .setIdentifier("bool")
  .setDescription(`Answers "true" or "false" randomly`)
  .addParameter((p) => p.setName("sentence").setRequired(false))
  .setExecution(async (messageInstance) => {
    let { methods, commandParameters } = messageInstance;
    methods.sendTextEmbed(
      `My answer is ${bold(
        inlineCode(utils.randomItem("true", "false"))
      )}`.concat(
        commandParameters.length !== 0 ? ` to\n${quote(commandParameters)}` : ""
      )
    );
  })
  .addHelpCommand();

export default boolean;
