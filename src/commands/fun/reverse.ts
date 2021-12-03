import { inlineCode } from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

import reactions from "../../assets/reactions";

const reverse = new CCommand()
	.setName("reverse")
	.setDescription("Reverses the specified text")
	.setExecution(async (messageInstance) => {
		let { methods, commandParameters } = messageInstance;
		const reverse = (text: string, acc: string[] = []): string => {
			let char = text.charAt(0);
			acc.unshift(char);
			if (text.length !== 0)
				return reverse(text.substring(1, text.length), acc);
			else return acc.join("");
		};
		methods.sendTextEmbed(
			`Here is you reversed text ${reactions.smile.random()}\n`.concat(
				inlineCode(reverse(commandParameters))
			)
		);
	});

export default reverse;
