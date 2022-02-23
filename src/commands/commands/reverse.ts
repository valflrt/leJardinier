import { inlineCode } from "@discordjs/builders";

import Command from "../../features/commands/command";

const reverse_cmd = new Command({
  name: "reverse",
  description: "Reverses the specified text",
  execution: async ({ actions, attributes }) => {
    const reverseText = (v: string): string[] =>
      v.length === 0 ? [] : reverseText(v.slice(1)).concat(v[0]);

    actions.sendTextEmbed(
      `Here is you reversed text:\n`.concat(
        inlineCode(reverseText(attributes.parameters).join(""))
      )
    );
  },
});

export default reverse_cmd;
