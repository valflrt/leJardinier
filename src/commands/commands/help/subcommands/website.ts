import { hyperlink } from "@discordjs/builders";

import Command from "../../../../features/commands/classes/command";

import reactions from "../../../../assets/reactions";

const website_cmd = new Command({
  name: "website",
  description: "Get my website link",
  execution: async ({ actions }) => {
    actions.sendTextEmbed(
      `Click ${hyperlink(
        `here`,
        `https://valflrt.github.io/lejardinier-typescript/`
      )} `.concat(`to get to my website ${reactions.smile.random}`)
    );
  },
});

export default website_cmd;
