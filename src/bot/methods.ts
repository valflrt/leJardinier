import { Message, MessageEmbed, MessageOptions, MessagePayload } from "discord.js";
import MessageInstance from "./message";

export default class ReplyMethods {

	private message: Message;
	private embed: MessageEmbed;

	constructor(messageInstance: MessageInstance) {
		this.message = messageInstance.message;
		this.embed = messageInstance.embed;
	}

	public answer = (message: string | MessagePayload | MessageOptions) => {
		this.message.reply(message);
	}

	public send = (message: string | MessagePayload | MessageOptions) => {
		this.message.channel.send(message);
	}

	public sendEmbed = (text: string, files = []) => {
		this.answer({
			embeds: [this.embed.setDescription(text)],
			files
		});
	}

	public returnEmbed = (text: string) => {
		return this.embed.setDescription(text);
	}

	public sendCustomEmbed = (config: Function, files = []) => {
		this.answer({
			embeds: [config(this.embed)],
			files
		});
	}

	public returnCustomEmbed = (config: Function) => {
		return config(this.embed);
	}

	public static mention = (userID: string): string => `<@!${userID}>`;

}