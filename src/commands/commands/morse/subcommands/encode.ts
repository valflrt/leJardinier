import { codeBlock } from "@discordjs/builders";

import Command from "../../../../features/commands/command";

import Morse from "../../../../features/morse";

const encode_cmd = new Command({
  name: "encode",
  description: "Encodes text to Morse code",
  parameters: [{ name: "sentence", required: true }],
  execution: async ({ actions, attributes }) => {
    if (attributes.parameters.length === 0)
      actions.sendTextEmbed(
        "You need to give some text to convert to Morse Code..."
      );
    else
      actions.sendTextEmbed(
        "Here is your Morse encoded text:".concat(
          codeBlock(Morse.encode(attributes.parameters))
        )
      );
  },
});

export default encode_cmd;
