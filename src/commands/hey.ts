import MessageInstance from "../bot/message";
import { Command } from "../types";
import * as utils from "../utils"

const hey: Command = {
	name: "hey",
	description: "Greet the bot",
	syntax: `hey`,
	execute: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		methods.sendEmbed(`${utils.randomItem("hey", "Hii", "Yo")} ${message.author} ${utils.randomItem(":3", ":)", "!")}`);
	}
};

export default hey;