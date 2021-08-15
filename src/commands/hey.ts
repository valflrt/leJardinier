import commands from ".";
import { Command } from "../types";
import MessageInfo from "../bot/message";

const hey: Command = {
	name: "hey",
	description: "Greet the bot",
	syntax: `hey`,
	execute: (messageInfo: MessageInfo) => {
		let { message } = messageInfo;
		message.embed(`${utils.randomItem("hey", "Hii", "Yo")} ${message.author} ${utils.randomItem(":3", ":)", "!")}`);
	}
});

commands.add(hey);

export default hey;