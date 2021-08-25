import MessageInstance from "../../bot/message";
import { Command } from "../../types";
import * as utils from "../../utils"

const trueorfalse: Command = {
	name: "trueorfalse",
	description: "Answer \"true\" or \"false\" randomly",
	syntax: `true or false <?sentence>`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, message, bot, commandArgs } = messageInstance;
		methods.sendEmbed(`${commandArgs && `${message.author}\n${commandArgs}\n${bot.user}\n`}${utils.randomItem("vrai !", "faux !")}`)
	}
}

export default trueorfalse;