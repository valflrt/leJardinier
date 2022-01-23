import CCommand from "../../features/commands/classes/command";
import * as utils from "../../utils";

import reactions from "../../assets/reactions";

const hey_cmd = new CCommand()
  .setName("hey")
  .setDescription("Greet the bot")
  .setExecution(async ({ message }) => {
    message.sendTextEmbed(
      `${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `.concat(
        `${message.author.toString()} ${reactions.smile.random}`
      )
    );
  })
  .addHelpCommand();

export default hey_cmd;
