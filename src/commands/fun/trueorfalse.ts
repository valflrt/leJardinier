import { Command } from "../../bot/command";
import * as utils from "../../utils";

const trueOrFalse = new Command({
	name: "tof",
	description: `Answers "true" or "false" randomly`,
	arguments: `[?sentence]`,
	execution: async (messageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendTextEmbed(
			`${
				commandArgs &&
				`${message.author.toString()}\n${commandArgs}\n${bot.user!.toString()}\n`
			}${utils.randomItem("true !", "false !")}`
		);
	},
});

export default trueOrFalse;
