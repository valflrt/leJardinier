import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";
import * as utils from "../../utils";

import reactions from "../../assets/reactions";

const hey = new Command({
	name: "hey",
	description: "Greet the bot",
	execution: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		methods.sendTextEmbed(
			`${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `.concat(
				`${message.author.toString()} ${reactions.smile.random()}`
			)
		);
	},
});

export default hey;
