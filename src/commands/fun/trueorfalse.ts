import CCommand from "../../lib/commandManager/classes/command";
import * as utils from "../../utils";

const trueOrFalse = new CCommand()
	.setName("true or false")
	.setIdentifier("tof")
	.setDescription(`Answers "true" or "false" randomly`)
	.addParameter((p) => p.setName("sentence").setRequired(false))
	.setExecution(async (messageInstance) => {
		let { methods, message, bot, commandParameters } = messageInstance;
		methods.sendTextEmbed(
			`${
				commandParameters.length !== 0
					? `${message.author.toString()}\n${commandParameters}\n${bot.user!.toString()}\n`
					: ""
			}${utils.randomItem("true !", "false !")}`
		);
	});

export default trueOrFalse;
