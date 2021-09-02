import MessageInstance from "../../bot/message";
import ReplyMethods from "../../bot/methods";
import { CommandType } from "../../bot/command";
import * as utils from "../../utils"

const hey: CommandType = {
	name: "hey",
	description: "Greet the bot",
	syntax: `hey`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		methods.sendEmbed(`${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} ${ReplyMethods.mention(message.author.id)} ${utils.randomItem(":3", ":)", "!")}`);
	}
}

export default hey;