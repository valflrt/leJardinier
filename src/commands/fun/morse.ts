import { MessageEmbed } from "discord.js";
import { codeBlock, inlineCode } from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

import morseTable from "../../assets/morseTable";

const morse = new CCommand()
	.setName("morse")
	.setDescription(`Morse code utility command`)
	.setExecution(async (messageInstance) => {
		let { methods } = messageInstance;

		methods.sendTextEmbed(
			`Use ${inlineCode(
				morse.commands.find((c) => c.name === "encode")!.syntax
			)} to encode text to Morse code`.concat(
				`Use ${
					morse.commands.find((c) => c.name === "table")!.syntax
				} to get Morse code table`
			)
		);
	})
	.addSubcommand((c) =>
		c
			.setName("encode")
			.setDescription("Encode text to Morse code")
			.addParameter((p) => p.setName("sentence").setRequired(true))
			.setExecution(async (messageInstance) => {
				let { methods, commandParameters } = messageInstance;

				const encode = (text: string, morse: string[] = []): string => {
					if (text.length === 0) return morse.join(" ");

					let char = text[0];

					let tableItem = morseTable.find(
						(item) => char.search(item[0]) !== -1
					);
					let morseLetter = !tableItem ? "?" : tableItem[1];

					if (char === " ") morse.push(" ");
					else morse.push(morseLetter);

					return encode(text.slice(1), morse);
				};

				if (commandParameters.length === 0)
					methods.sendTextEmbed(
						"You need to give some text to convert to morse..."
					);
				else
					methods.sendTextEmbed(
						"Here is your morse encoded text:".concat(
							codeBlock(encode(commandParameters.toLowerCase()))
						)
					);
			})
			.addHelpCommand()
	)
	.addSubcommand((c) =>
		c
			.setName("table")
			.setDescription("Gives the Morse table")
			.setExecution(async (messageInstance) => {
				let { methods } = messageInstance;

				methods.sendCustomEmbed((embed: MessageEmbed) =>
					embed.setDescription(`Here is the morse table\n
					${morseTable.map((char) => `${char[0]}: ${inlineCode(char[1])}`).join("\n")}`)
				);
			})
			.addHelpCommand()
	);

export default morse;
