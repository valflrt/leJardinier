import CCommand from "../../features/commands/classes/command";
import { time } from "@discordjs/builders";

import reactions from "../../assets/reactions";

const time_cmd = new CCommand()
  .setName("time")
  .setDescription("Get the time")
  .setExecution(async ({ message }) => {
    message.sendTextEmbed(
      `It is ${time(new Date(), "t")} ${reactions.smile.random}`
    );
  })
  .addHelpCommand();

export default time_cmd;
