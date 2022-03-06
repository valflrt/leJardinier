import { inlineCode } from "@discordjs/builders";

import Command from "../../../../features/commands/command";

import morseTable from "../../../../assets/morseTable";

const table_cmd = new Command({
  name: "table",
  description: "Gives the Morse table",
  execution:
    () =>
    async ({ actions }) => {
      actions.sendCustomEmbed((embed) =>
        embed.setDescription(`Here is the morse table\n
					${morseTable.map((char) => `${char[0]}: ${inlineCode(char[1])}`).join("\n")}`)
      );
    },
});

export default table_cmd;
