import { inlineCode } from "@discordjs/builders";

import Command from "../../features/commands/command";

import { randomItem } from "../../utils";

const choose_cmd = new Command({
  name: "choose",
  description: "Chooses one of the items specified",
  execution: async ({ actions, attributes }) => {
    let items = attributes.parameters.split(/\s*\|\s*/g);
    let item = randomItem(...items);
    actions.sendTextEmbed(
      `I choose: ${
        item.search(/\<.+[0123456789]{18}\>/g) === -1 ? inlineCode(item) : item
      }`
    );
  },
});

export default choose_cmd;
