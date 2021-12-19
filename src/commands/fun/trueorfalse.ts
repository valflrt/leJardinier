import { bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";
import * as utils from "../../utils";

const trueOrFalse = new CCommand()
  .setName("true or false")
  .setIdentifier("tof")
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

export default trueOrFalse;
