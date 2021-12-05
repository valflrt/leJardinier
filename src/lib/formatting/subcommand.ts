import { EmbedFieldData } from "discord.js";
import { bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../commandManager/classes/command";

export default class CSubcommandPreview {
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
							`Alias${
								command.aliases.length > 1 ? "es" : ""
							}: ${command.aliases
								.map((a) => bold(inlineCode(a)))
								.join(" ")}`
					  )}`
					: ""
			);
		this.whole = this.title.concat(`\n${this.description}`);
	}

	public static createFields(commands: CCommand[]): EmbedFieldData[] {
		return commands
			.filter((c) => !c.settings.hidden)
			.map((command): EmbedFieldData => {
				let preview = new CSubcommandPreview(command);
				return { name: preview.title, value: preview.description };
			});
	}
}
