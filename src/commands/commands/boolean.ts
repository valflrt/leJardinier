import { bold, inlineCode, quote } from "@discordjs/builders";

import Command from "../../features/commands/command";
import * as utils from "../../utils";

const boolean_cmd = new Command({
  name: "boolean",
  identifier: "bool",
  description: `Answers "true" or "false" randomly`,
  parameters: [{ name: "sentence", required: false }],
  execution: async ({ actions, attributes }) => {
    actions.sendTextEmbed(
      `My answer is ${bold(
        inlineCode(utils.randomItem("true", "false"))
      )}`.concat(
        attributes.parameters.length !== 0
          ? ` to\n${quote(attributes.parameters)}`
          : ""
      )
    );
  },
});

export default boolean_cmd;
