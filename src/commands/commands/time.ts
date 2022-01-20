import CCommand from "../../features/commands/classes/command";
import { time } from "@discordjs/builders";

import reactions from "../../assets/reactions";

const time__cmd = new CCommand()
  .setName("time")
  .setDescription("Get the time")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendTextEmbed(
      `It is ${time(new Date(), "t")} ${reactions.smile.random}`
    );
  })
  .addHelpCommand();

export default time_cmd;
