import CCommand from "../../managers/commands/classes/command";

import { linkButton } from "../../bot/interactions";
import reactions from "../../assets/reactions";

const invite = new CCommand()
    .setName("invite")
    .setDescription("Get bot invitation link")
    .setExecution(async (messageInstance) => {
        let { methods, bot } = messageInstance;
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

export default invite;
