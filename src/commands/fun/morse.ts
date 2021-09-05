import MessageInstance from "../../bot/message";
import { Command } from "../../bot/command";

import morseTable from "../../assets/morse.table";

const morse = new Command({
	name: "morse",
	description: `Encode text to Morse code`,
	syntax: `morse [sentence]`,
	category: { name: "Fun", order: 1 },
	execution: (messageInstance: MessageInstance) => {
		let { methods, commandArgs } = messageInstance;

		const encode = (text: string, morse: string[] = []): string => {

			let char = text.charAt(0);

			let morseLetter = morseTable.find(item => item[0] === char);

			if (morseLetter) morse.push(morseLetter[1]);
			else if (char === " ") morse.push("|");

			if (text.length === 0) return morse.join("  ");
			else return encode(text.slice(1), morse);
		};

		methods.sendEmbed(commandArgs ? encode(commandArgs?.toLowerCase().replace(/[^abcdefghijklmopqrstuvwxyz\s]/g, "")) : "You need to give some text to convert to morse...");
	}
})

export default morse;