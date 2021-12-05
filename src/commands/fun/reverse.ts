import { inlineCode } from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

const reverse = new CCommand()
	.setName("reverse")
	.setDescription("Reverses the specified text")
	.setExecution(async (messageInstance) => {
		let { methods, commandParameters } = messageInstance;
		const reverseText = (v: string): string[] =>
			v.length === 0 ? [] : reverseText(v.slice(1)).concat(v[0]);
		//(text: string, acc: string[] = []): string => {
		// 	let char = text.charAt(0);
		// 	acc.unshift(char);
		// 	if (text.length !== 0)
		// 		return reverseText(text.substring(1, text.length), acc);
		// 	else return acc.join("");
		// };
		methods.sendTextEmbed(
			`Here is you reversed text:\n`.concat(
				inlineCode(reverseText(commandParameters).join(""))
			)
		);
	})
	.export();

export default reverse;
