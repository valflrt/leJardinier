import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";
import * as utils from "../../utils"

const hey = new Command({
	name: "hey",
	description: "Greet the bot",
	execution: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;
		methods.sendEmbed(`${utils.randomItem("Hey", "Hii", "Heyaa", "Yo")} `
			.concat(`${message.author.toString()} ${utils.randomItem(":3", ":)", "!")}`)
		);
	}
})

export default hey;