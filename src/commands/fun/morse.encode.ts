import MessageInstance from "../../bot/message";
import { CommandType } from "../../bot/command";

import morseTable from "../../assets/morse.table";

const morseEncode: CommandType = {
	name: "morse encode",
	description: `Encode text to Morse code`,
	syntax: `morse encode [sentence]`,
	execution: (messageInstance: MessageInstance) => {
		let { methods, commandArgs } = messageInstance;

		const encode = (text: string, morse: string[] = []): string => {

			let char = text.substr(0, 1);

			let morseLetter = morseTable.find(item => item[0] === char);

			if (morseLetter) morse.push(morseLetter[1]);
			else if (char === " ") morse.push("|");

			if (text.length === 0) return morse.reverse().join("  ");
			else return encode(text.slice(1), morse);
		};

		methods.sendEmbed(commandArgs ? encode(commandArgs?.replace(/[^abcdefghijklmopqrstuvwxyz\s]/g, "")) : "You need to give some text to convert to morse...");
	}
}

export default morseEncode;