import { Client, Message, MessageEmbed } from "discord.js";

//import { guildManager, userManager, statManager } from "./database";
import ReplyMethods from "./methods";
import log from "./log";

import { ICommand } from "../types";
import commands from "../commands";

import config from "../config";

class MessageInstance {
	public message: Message;
	public bot: Client;

	public methods: ReplyMethods;
	public command: ICommand | undefined;
	public commandArgs: string | null;

	constructor(message: Message, bot: Client) {
		this.message = message;
		this.bot = bot;

		this.command = commands.fetch(this.message.content);
		this.commandArgs = this.command
			? this.message.content
					.replace(
						new RegExp(
							`^${config.prefix}.+${this.command!.name}`,
							"g"
						),
						""
					)
					.trim()
			: null;

		this.methods = new ReplyMethods(this);
	}

	/**
	 * returns a boolean whether a command has been found or not
	 * @returns {boolean}
	 */
	get hasCommand(): boolean {
		return this.command ? true : false;
	}

	/**
	 * returns a boolean whether the message content starts with the prefix or not
	 * @returns {boolean}
	 */
	get hasPrefix(): boolean {
		return this.message.content.startsWith(config.prefix);
	}

	/**
	 * returns a new formatted MessageEmbed
	 * @returns {MessageEmbed}
	 */
	get embed(): MessageEmbed {
		return new MessageEmbed()
			.setAuthor(
				this.bot.user!.username,
				"https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp"
			)
			.setFooter(this.command ? this.command.syntax! : "")
			.setColor("#49a013")
			.setTimestamp();
	}

	/**
	 * executes the current command
	 * @returns {Promise<void>}
	 */
	public async execute(): Promise<void> {
		if (!this.command) return log.logger.error(`Command does not exist`);

		log.command.startTimer();
		await this.message.channel.sendTyping();

		try {
			await this.command!.execution(this);
			log.command.executed(this.command!);
		} catch (err) {
			log.command.executionFailed(this.command!, err);
		}
	}

	/*private beforeExecute = async () => {
		let guildExists = await guildManager.exists(this.message.guild!.id);
		if (this.command!.requiresDB === true && guildExists === false) {
			this.methods
				.sendTextEmbed(`This command requires registering the guild
				Use \`${commands.get("register")!.syntax}\` for more information.`);
		}
	};*/
}

export default MessageInstance;
