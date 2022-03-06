import Command from "../../features/commands/command";
import { time } from "@discordjs/builders";

import reactions from "../../assets/reactions";

const time_cmd = new Command({
  name: "time",
  description: "Get the time",
  execution:
    () =>
    async ({ actions }) => {
      actions.sendTextEmbed(
        `It is ${time(new Date(), "t")} ${reactions.smile.random}`
      );
    },
});

export default time_cmd;
