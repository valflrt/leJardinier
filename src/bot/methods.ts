import { Message, MessageEmbed, MessageOptions, MessagePayload } from "discord.js";
import MessageInstance from "./message";

export default class ReplyMethods {

	private messageInstance: MessageInstance;
	private message: Message;
	private embed: MessageEmbed;

	constructor(message: MessageInstance) {
		this.messageInstance = message;
		this.message = this.messageInstance.message;
		this.embed = this.messageInstance.embed;
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

}