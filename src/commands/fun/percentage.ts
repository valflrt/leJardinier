import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";
import * as utils from "../../utils";

const percentage = new Command({
	name: "percentage",
	description: "Gives a random percentage",
	arguments: `[?sentence]`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendTextEmbed(
			`${
				commandArgs &&
				`${message.author.toString()}\n${commandArgs}\n${bot.user!.toString()}\n`
			}`.concat(
				`${
					utils.oneOf(100)
						? utils.randomNumber(100, 300)
						: utils.randomNumber(0, 100)
				}%`
			)
		);
	},
});

export default percentage;
