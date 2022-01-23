import CCommand from "../../features/commands/classes/command";

import { linkButton } from "../../bot/interactions";
import reactions from "../../assets/reactions";

const invite_cmd = new CCommand()
  .setName("invite")
  .setDescription("Get bot invitation link")
  .setExecution(async ({ methods, bot }) => {
    methods.sendTextEmbed(
      `Click the button bellow if you want me to hop in your server ${reactions.smile.random}`,
      {
        components: [
          linkButton(
            "Invite me !",
            bot.generateInvite({
              scopes: ["bot"],
              permissions: "ADMINISTRATOR",
            })
          ),
        ],
      }
    );
  })
  .addHelpCommand();

export default invite_cmd;
