import { bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";
import * as utils from "../../utils";

const percentage = new CCommand()
  .setName("percentage")
  .setDescription("Gives a random percentage")
  .addParameter((p) => p.setName("sentence").setRequired(false))
  .setExecution(async (messageInstance) => {
    let { methods, commandParameters } = messageInstance;
    methods.sendTextEmbed(
      `My answer is ${bold(
        inlineCode(
          `${
            // has a 1/100 chance to give a number between 100% and 1000%
            !utils.oneOf(100)
              ? utils.randomNumber(0, 100)
              : utils.randomNumber(100, 1000)
          }%`
        )
      )}`.concat(
        commandParameters.length !== 0
          ? ` to\n${quote(commandParameters)}\n`
          : ""
      )
    );
  })
  .addHelpCommand();

export default percentage;
