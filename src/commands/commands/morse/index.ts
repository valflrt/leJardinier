import { inlineCode } from "@discordjs/builders";

import CCommand from "../../../features/commands/classes/command";

// subcommands imports
import encode_cmd from "./subcommands/encode";
import decode_cmd from "./subcommands/decode";
import table_cmd from "./subcommands/table";

const morse_cmd = new CCommand()
  .setName("morse")
  .setDescription(`Morse code utility command`)
  .setExecution(async ({ message }) => {
    message.sendTextEmbed(
      `Use ${inlineCode(
        morse_cmd.commands.find((c) => c.name === "encode")!.syntax
      )} to encode text to Morse code`.concat(
        `Use ${
          morse_cmd.commands.find((c) => c.name === "table")!.syntax
        } to get Morse code table`
      )
    );
  })

  .addSubcommand(() => encode_cmd)
  .addSubcommand(() => decode_cmd)
  .addSubcommand(() => table_cmd);

export default morse_cmd;
