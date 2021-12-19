import { MessageEmbed } from "discord.js";
import { codeBlock, inlineCode } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";

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
			.setDescription("Encodes text to Morse code")
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

					morse.push(morseLetter);

					return encode(text.slice(1), morse);
				};

				if (commandParameters.length === 0)
					methods.sendTextEmbed(
						"You need to give some text to convert to Morse Code..."
					);
				else
					methods.sendTextEmbed(
						"Here is your Morse encoded text:".concat(
							codeBlock(
								commandParameters
									.split(/\s+/g)
									.map((w) => encode(w))
									.join(" / ")
									.toLowerCase()
							)
						)
					);
			})
			.addHelpCommand()
	)
	.addSubcommand((c) =>
		c
			.setName("decode")
			.setDescription("Decodes Morse code")
			.addParameter((p) => p.setName("morse code").setRequired(true))
			.setExecution(async (messageInstance) => {
				let { methods, commandParameters } = messageInstance;

				const decode = (
					chars: string[],
					decoded: string[] = []
				): string => {
					if (chars.length === 0) return decoded.join("");

					let char = chars[0];

					let tableItem = morseTable.find((item) => item[1] === char);
					let letter = !tableItem ? "?" : tableItem[2];

					decoded.push(letter);

					return decode(chars.slice(1), decoded);
				};

				if (commandParameters.length === 0)
					methods.sendTextEmbed(
						"You need to give some Morse to decode..."
					);
				else
					methods.sendTextEmbed(
						"Here is your decoded text:".concat(
							codeBlock(
								commandParameters
									.split(/\s\/\s/g)
									.map((w) => decode(w.split(/\s/g)))
									.join(" ")
									.toLowerCase()
									.trim()
							)
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
