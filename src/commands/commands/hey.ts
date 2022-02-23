import Command from "../../features/commands/command";
import * as utils from "../../utils";

import reactions from "../../assets/reactions";

const hey_cmd = new Command({
  name: "hey",
  description: "Greet the bot",
  execution: async ({ actions, message }) => {
    actions.sendTextEmbed(
      `${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `.concat(
        `${message.author.toString()} ${reactions.smile.random}`
      )
    );
  },
});

export default hey_cmd;
