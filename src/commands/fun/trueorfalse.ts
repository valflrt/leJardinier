import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";
import * as utils from "../../utils";

const trueOrFalse = new Command({
	name: "tof",
	description: `Answers "true" or "false" randomly`,
	arguments: `[?sentence]`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendEmbed(
			`${
				commandArgs &&
				`${message.author.toString()}\n${commandArgs}\n${bot.user!.toString()}\n`
			}${utils.randomItem("true !", "false !")}`
		);
	},
});

export default trueOrFalse;
