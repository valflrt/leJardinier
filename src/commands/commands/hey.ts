import CCommand from "../../features/commands/classes/command";
import * as utils from "../../utils";

import reactions from "../../assets/reactions";

const hey__cmd = new CCommand()
  .setName("hey")
  .setDescription("Greet the bot")
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;
    methods.sendTextEmbed(
      `${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `.concat(
        `${message.author.toString()} ${reactions.smile.random}`
      )
    );
  })
  .addHelpCommand();

export default hey_cmd;
