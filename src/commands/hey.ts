import MessageInstance from "../bot/message";
import { Command } from "../types";
import ReplyMethods from "../bot/methods";
import * as utils from "../utils"

const hey: Command = {
	name: "hey",
	description: "Greet the bot",
	syntax: `hey`,
	execute: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		methods.sendEmbed(`${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} ${ReplyMethods.mention(message.author.id)} ${utils.randomItem(":3", ":)", "!")}`);
	}
}

export default hey;