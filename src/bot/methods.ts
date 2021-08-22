import { Message, MessageOptions, MessagePayload } from "discord.js";
import MessageInstance from "./message";

export default class ReplyMethods {

	private message: Message;
	private messageInstance: MessageInstance;

	constructor(messageInstance: MessageInstance) {
		this.message = messageInstance.message;
		this.messageInstance = messageInstance;
	}

	public answer = (message: string | MessagePayload | MessageOptions) => {
		return this.message.reply(message);
	}

	public send = (message: string | MessagePayload | MessageOptions) => {
		return this.message.channel.send(message);
	}

	public sendEmbed = (text: string, files = []) => {
		return this.answer({
			embeds: [this.messageInstance.generateEmbed().setDescription(text)],
			files
		})
	}

	public returnEmbed = (text: string) => {
		return this.messageInstance.generateEmbed().setDescription(text);
	}

	public sendCustomEmbed = (config: Function, files = []) => {
		return this.answer({
			embeds: [config(this.messageInstance.generateEmbed())],
			files
		})
	}

	public returnCustomEmbed = (config: Function) => {
		return config(this.messageInstance.generateEmbed());
	}

	public static mention = (userID: string): string => `<@!${userID}>`;

}