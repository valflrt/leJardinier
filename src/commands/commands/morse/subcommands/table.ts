import { inlineCode } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import morseTable from "../../../../assets/morseTable";

const table_cmd = new CCommand()
  .setName("table")
  .setDescription("Gives the Morse table")
  .setExecution(async ({ message }) => {
    message.sendCustomEmbed((embed) =>
      embed.setDescription(`Here is the morse table\n
					${morseTable.map((char) => `${char[0]}: ${inlineCode(char[1])}`).join("\n")}`)
    );
  })
  .addHelpCommand();

export default table_cmd;
