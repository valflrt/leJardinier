import {
	Message,
	MessageEmbed,
	MessagePayload,
	ReplyMessageOptions,
} from "discord.js";

import MessageInstance from "./message";
import { SentMessage } from "../types";

export default class ReplyMethods {
	private message: Message;
	private messageInstance: MessageInstance;

	constructor(messageInstance: MessageInstance) {
		this.message = messageInstance.message;
		this.messageInstance = messageInstance;
	}

	/**
	 * replies to the call message
	 * @param options message options
	 */
	public reply = (options: string | MessagePayload | ReplyMessageOptions) => {
		return this.message.reply(options);
	};

	/**
	 * sends a message in the current channel
	 * @param options messages options
	 */
	public send = (options: string | MessagePayload | ReplyMessageOptions) => {
		return this.message.channel.send(options);
	};

	/**
	 * sends an already created MessageEmbed
	 * @param embed already created embed
	 * @param options message options
	 */
	public async sendEmbed(
		embed: MessageEmbed,
		options: ReplyMessageOptions = {}
	): Promise<SentMessage> {
		if (!options.embeds) options.embeds = [];
		options.embeds.push(embed);
		let sent = (await this.reply(options)) as SentMessage;
		return this.initSent(sent);
	}

	/**
	 * sends an embed
	 * @param content text to send
	 * @param options message options
	 */
	public async sendTextEmbed(
		content: string,
		options: ReplyMessageOptions = {}
	): Promise<SentMessage> {
		return await this.sendEmbed(this.returnTextEmbed(content), options);
	}

	/**
	 * returns a simple text embed
	 * @param content text to send as the description of the MessageEmbed
	 */
	public returnTextEmbed(content: string): MessageEmbed {
		return this.messageInstance.embed.setDescription(content);
	}

	/**
	 * creates a custom MessageEmbed using a callback and sends it
	 * @param setup the callback function
	 * @param options message options
	 */
	public async sendCustomEmbed(
		setup: (embed: MessageEmbed) => MessageEmbed,
		options: ReplyMessageOptions = {}
	): Promise<SentMessage> {
		return await this.sendEmbed(this.returnCustomEmbed(setup), options);
	}

	/**
	 * sets up a custom embed and returns it
	 * @param setup the callback function
	 */
	public returnCustomEmbed(
		setup: (embed: MessageEmbed) => MessageEmbed
	): MessageEmbed {
		return setup(this.messageInstance.embed);
	}

	/**
	 * Adds two new functions to a "MessageSent" object and returns it
	 * @param sent object which needs to get the new functions added
	 */
	private initSent(sent: SentMessage): SentMessage {
		sent.editWithEmbed = (
			embed: MessageEmbed,
			options: ReplyMessageOptions = {}
		) => {
			if (!options.embeds) options.embeds = [];
			options.embeds.push(embed);
			return sent.edit(options);
		};
		sent.editWithTextEmbed = (
			text: string,
			options: ReplyMessageOptions = {}
		) => sent.editWithEmbed(this.returnTextEmbed(text), options);
		sent.editWithCustomEmbed = (
			setup: (embed: MessageEmbed) => MessageEmbed,
			options: ReplyMessageOptions = {}
		) => sent.editWithEmbed(this.returnCustomEmbed(setup), options);
		return sent;
	}
}
