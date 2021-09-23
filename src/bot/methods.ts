import { Message, MessageOptions, MessagePayload } from "discord.js";

import MessageInstance from "./message";

export default class ReplyMethods {
	private message: Message;
	private messageInstance: MessageInstance;

	constructor(messageInstance: MessageInstance) {
		this.message = messageInstance.message;
		this.messageInstance = messageInstance;
	}

	public answer = (options: string | MessagePayload | MessageOptions) => {
		return this.message.reply(options);
	};

	public send = (options: string | MessagePayload | MessageOptions) => {
		return this.message.channel.send(options);
	};

	public sendEmbed = (content: string, options: MessageOptions = {}) => {
		if (!options.embeds) options.embeds = [];
		options.embeds.push(this.returnEmbed(content));
		return this.answer(options);
	};

	public returnEmbed = (text: string) => {
		return this.messageInstance.generateEmbed().setDescription(text);
	};

	public sendCustomEmbed = (
		setup: Function,
		options: MessageOptions = {}
	) => {
		if (!options.embeds) options.embeds = [];
		options.embeds.push(this.returnCustomEmbed(setup));
		return this.answer(options);
	};

	public returnCustomEmbed = (setup: Function) =>
		setup(this.messageInstance.generateEmbed());
}
