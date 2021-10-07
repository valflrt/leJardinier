import { Message, MessageEmbed } from "discord.js/typings/index.js";

export interface ICommand {
	name: string;
	description: string;
	arguments?: string;
	syntax?: string;
	categoryName?: string;
	requiresDB?: boolean;
	execution: Function;
	commands?: ICommand[];
}

export interface ICategory {
	name: string;
	commands: ICommand[];
}

export interface SentMessage extends Message {
	editWithEmbed: (embed: MessageEmbed) => Promise<Message>;
	editWithTextEmbed: (text: string) => Promise<Message>;
	editWithCustomEmbed: (
		setup: (embed: MessageEmbed) => MessageEmbed
	) => Promise<Message>;
}
