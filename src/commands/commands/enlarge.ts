import { codeBlock } from "@discordjs/builders";

import Command from "../../features/commands/classes/command";

const enlarge_cmd = new Command({
  name: "enlarge",
  description: "Enlarges text",
  execution: async ({ actions, attributes }) => {
    actions.sendTextEmbed(
      codeBlock(attributes.parameters).replace(/(?=.)(?<=.)/g, " ")
    );
  },
});

export default enlarge_cmd;
