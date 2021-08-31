import MessageInstance from "../../bot/message";
import { Command } from "../../types";
import ReplyMethods from "../../bot/methods";
import * as utils from "../../utils"

const percentage: Command = {
	name: "percentage",
	description: "Greet the bot",
	syntax: `percentage [?sentence]`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendEmbed(`${commandArgs && `${ReplyMethods.mention(message.author.id)}\n${commandArgs}\n${ReplyMethods.mention(bot.user!.id)}\n`}${utils.oneOf(100) ? utils.randomNumber(100, 300) : utils.randomItem(0, 100)}%`)
	}
}

export default percentage;