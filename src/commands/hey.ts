import { Command } from "../types";
import MessageInfo from "../bot/message";
import * as utils from "../utils"

const hey: Command = {
	name: "hey",
	description: "Greet the bot",
	syntax: `hey`,
	execute: (messageInfo: MessageInfo) => {
		let { methods, message } = messageInfo;
		methods.embed(`${utils.randomItem("hey", "Hii", "Yo")} ${message.author} ${utils.randomItem(":3", ":)", "!")}`);
	}
};

export default hey;