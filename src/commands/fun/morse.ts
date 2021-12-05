import { MessageEmbed } from "discord.js";
import { inlineCode } from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

import morseTable from "../../assets/morse.table";

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
					let char = text.charAt(0);

					let morseLetter = morseTable.find(
						(item) => item[0] === char
					);

					if (morseLetter) morse.push(morseLetter[1]);
					else if (char === " ") morse.push("|");

					if (text.length === 0) return morse.join("  ");
					else return encode(text.slice(1), morse);
				};

				methods.sendTextEmbed(
					commandParameters.length !== 0
						? encode(
								commandParameters
									.toLowerCase()
									.replace(
										/[^abcdefghijklmopqrstuvwxyz\s]/g,
										""
									)
						  )
						: "You need to give some text to convert to morse..."
				);
			})
			.export()
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
			.export()
	)
	.export();

export default morse;
