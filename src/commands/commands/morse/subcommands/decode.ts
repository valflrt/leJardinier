import { codeBlock } from "@discordjs/builders";

import Command from "../../../../features/commands/command";

import Morse from "../../../../features/morse";

const decode_cmd = new Command({
  name: "decode",
  description: "Decodes Morse code",
  parameters: [{ name: "morse code", required: true }],
  execution:
    () =>
    async ({ actions, attributes }) => {
      if (attributes.parameters.length === 0)
        actions.sendTextEmbed("You need to give some Morse to decode...");
      else
        actions.sendTextEmbed(
          "Here is your decoded text:".concat(
            codeBlock(Morse.decode(attributes.parameters))
          )
        );
    },
});

export default decode_cmd;
