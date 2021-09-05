import MessageInstance from "../../bot/message";
import ReplyMethods from "../../bot/methods";
import { Command } from "../../bot/command";
import * as utils from "../../utils"

const percentage = new Command({
	name: "percentage",
	description: "Gives a random percentage",
	syntax: `percentage [?sentence]`,
	category: { name: "Fun", order: 1 },
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendEmbed(`${commandArgs && `${ReplyMethods.mention(message.author.id)}\n${commandArgs}\n${ReplyMethods.mention(bot.user!.id)}\n`}${utils.oneOf(100) ? utils.randomNumber(100, 300) : utils.randomNumber(0, 100)}%`)
	}
})

export default percentage;