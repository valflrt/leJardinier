import MessageInstance from "../../bot/message";
import ReplyMethods from "../../bot/methods";
import { Command } from "../../bot/command";
import * as utils from "../../utils"

const trueorfalse = new Command({
	name: "tof",
	description: `Answers "true" or "false" randomly`,
	arguments: `[?sentence]`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendEmbed(`${commandArgs && `${ReplyMethods.mention(message.author.id)}\n${commandArgs}\n${ReplyMethods.mention(bot.user!.id)}\n`}${utils.randomItem("true !", "false !")}`);
	}
})

export default trueorfalse;