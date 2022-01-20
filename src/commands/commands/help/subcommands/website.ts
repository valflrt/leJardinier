import { hyperlink } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import reactions from "../../../../assets/reactions";

const website__cmd = new CCommand()
  .setName("website")
  .setDescription("Get my website link")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendTextEmbed(
      `Click ${hyperlink(
        `here`,
        `https://valflrt.github.io/lejardinier-typescript/`
      )} `.concat(`to get to my website ${reactions.smile.random}`)
    );
  })
  .addHelpCommand();

export default website_cmd;
