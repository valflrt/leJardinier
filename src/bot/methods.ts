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
	 * @returns
	 */
	public reply = (options: string | MessagePayload | ReplyMessageOptions) => {
		return this.message.reply(options);
	};

	/**
	 * sends a message in the current channel
	 * @param options messages options
	 * @returns
	 */
	public send = (options: string | MessagePayload | ReplyMessageOptions) => {
		return this.message.channel.send(options);
	};

	/**
	 * sends an already created MessageEmbed
	 * @param embed {MessageEmbed} already created embed
	 * @param options {ReplyMessageOptions}
	 * @returns {Promise<SentMessage>}
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
	 *
	 * @param content {string} text to send
	 * @param options {ReplyMessageOptions}
	 * @returns {Promise<SentMessage>}
	 */
	public async sendTextEmbed(
		content: string,
		options: ReplyMessageOptions = {}
	): Promise<SentMessage> {
		let sent = await this.sendEmbed(this.returnTextEmbed(content), options);
		return this.initSent(sent);
	}

	/**
	 * returns a simple text embed
	 * @param content {string} text to send as the description of the MessageEmbed
	 * @returns {MessageEmbed}
	 */
	public returnTextEmbed(content: string): MessageEmbed {
		return this.messageInstance.generateEmbed().setDescription(content);
	}

	/**
	 * creates a custom MessageEmbed and sends it
	 * @param setup setup function
	 * @param options {ReplyMessageOptions}
	 * @returns {Promise<SentMessage>}
	 */
	public async sendCustomEmbed(
		setup: (embed: MessageEmbed) => MessageEmbed,
		options: ReplyMessageOptions = {}
	): Promise<SentMessage> {
		let sent = await this.sendEmbed(this.returnCustomEmbed(setup), options);
		return this.initSent(sent);
	}

	/**
	 * sets up a custom embed and returns it
	 * @param setup {Function} setup function
	 * @returns {MessageEmbed} embed that has been set up
	 */
	public returnCustomEmbed(
		setup: (embed: MessageEmbed) => MessageEmbed
	): MessageEmbed {
		return setup(this.messageInstance.generateEmbed());
	}

	/**
	 * Adds two new functions to a "MessageSent" object
	 * @param sent {SentMessage} object which needs to get the new functions added
	 * @returns {SentMessage} formatted Message class
	 */
	private initSent(sent: SentMessage): SentMessage {
		sent.editWithEmbed = (embed: MessageEmbed) =>
			sent.edit({ embeds: [embed] });
		sent.editWithTextEmbed = (text: string) =>
			sent.editWithEmbed(this.returnTextEmbed(text));
		sent.editWithCustomEmbed = (
			setup: (embed: MessageEmbed) => MessageEmbed
		) => sent.editWithEmbed(this.returnCustomEmbed(setup));
		return sent;
	}
}
