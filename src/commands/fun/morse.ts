import { MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

import morseTable from "../../assets/morse.table";

const morse = new Command({
	name: "morse",
	description: `Morse code utility command`,
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		methods.sendEmbed(
			`Use \`lj!morse encode\` to encode text to Morse code`.concat(
				`Use \`lj!morse table\` to get Morse code table`
			)
		);
	},
	commands: [
		new Command({
			name: "encode",
			description: `Encode text to Morse code`,
			arguments: `[sentence]`,
			execution: (messageInstance: MessageInstance) => {
				let { methods, commandArgs } = messageInstance;

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

				methods.sendEmbed(
					commandArgs
						? encode(
								commandArgs
									?.toLowerCase()
									.replace(
										/[^abcdefghijklmopqrstuvwxyz\s]/g,
										""
									)
						  )
						: "You need to give some text to convert to morse..."
				);
			},
		}),
		new Command({
			name: "table",
			description: `Gives the Morse table`,
			execution: (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;

				methods.sendCustomEmbed((embed: MessageEmbed) =>
					embed.setDescription(`Here is the morse table\n
					${morseTable.map((char) => `${char[0]}: \`${char[1]}\``).join("\n")}`)
				);
			},
		}),
	],
});

export default morse;
