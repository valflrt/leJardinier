import { codeBlock } from "@discordjs/builders";

import Command from "../../features/commands/command";

const enlarge_cmd = new Command({
  name: "enlarge",
  description: "Enlarges text",
  execution:
    () =>
    async ({ actions, attributes }) => {
      actions.sendTextEmbed(
        codeBlock(attributes.parameters.replace(/(?=.)(?<=.)/gi, " "))
      );
    },
});

export default enlarge_cmd;
