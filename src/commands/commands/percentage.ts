import { bold, inlineCode, quote } from "@discordjs/builders";

import Command from "../../features/commands/command";
import * as utils from "../../utils";

const percentage_cmd = new Command({
  name: "percentage",
  description: "Gives a random percentage",
  parameters: [{ name: "sentence", required: false }],
  execution:
    () =>
    async ({ actions, attributes }) => {
      actions.sendTextEmbed(
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
          attributes.parameters.length !== 0
            ? ` to\n${quote(attributes.parameters)}\n`
            : ""
        )
      );
    },
});

export default percentage_cmd;
