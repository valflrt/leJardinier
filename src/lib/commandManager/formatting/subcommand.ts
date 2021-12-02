import { EmbedFieldData } from "discord.js";
import { bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../classes/command";

export default class CCSubcommandPreview {
	public title: string;
	public description: string;
	public whole: string;

	constructor(command: CCommand) {
		this.title = `${bold(command.name)}`;
		this.description = quote(`${command.description}\n`)
			.concat(quote(`Usage: ${bold(inlineCode(command.syntax!))}`))
			.concat(
				command.aliases.length !== 0
					? `\n${quote(
							`Alias(es): ${command.aliases
								.map((a) => bold(inlineCode(a)))
								.join(" ")}`
					  )}`
					: ""
			);
		this.whole = this.title.concat(`\n${this.description}`);
	}

	public static createFields(commands: CCommand[]) {
		return commands.map((command): EmbedFieldData => {
			let preview = new CCSubcommandPreview(command);
			return { name: preview.title, value: preview.description };
		});
	}
}
