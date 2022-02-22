import Command from "../../features/commands/classes/command";

import lejardinier from "../..";

import reactions from "../../assets/reactions";
import { MessageActionRow, MessageButton } from "discord.js";

const invite_cmd = new Command({
  name: "invite",
  description: "Get bot invitation link",
  execution: async ({ actions }) => {
    actions.sendTextEmbed(
      `Click the button bellow if you want me to hop in your server ${reactions.smile.random}`,
      {
        components: [
          new MessageActionRow({
            components: [
              new MessageButton()
                .setStyle("LINK")
                .setLabel("Invite me !")
                .setURL(
                  lejardinier.client.generateInvite({
                    scopes: ["bot"],
                    permissions: "ADMINISTRATOR",
                  })
                ),
            ],
          }),
        ],
      }
    );
  },
});

export default invite_cmd;
