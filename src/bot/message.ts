import { Client, Message, MessageEmbed } from "discord.js";
import { hyperlink } from "@discordjs/builders";

import CCommand from "../lib/commandManager/classes/command";
import CMessageParser from "../lib/commandManager/classes/messageParser";

//import { guildManager, userManager, statManager } from "./database";
import ReplyMethods from "./methods";
import log from "./log";

import commandList from "../commands";
import config from "../config";
import reactions from "../assets/reactions";

class MessageInstance {
	public message: Message;
	public bot: Client;

	public methods: ReplyMethods;
	public command: CCommand | null;
	public commandParameters: string;

	constructor(message: Message, bot: Client) {
		this.message = message;
		this.bot = bot;

		let messageContent = new CMessageParser(this.message.content);

		this.command = commandList.find(messageContent.commandPattern);
		this.commandParameters = messageContent.parameters;

		this.methods = new ReplyMethods(this);
	}

	/**
	 * returns a boolean whether a command has been found or not
	 */
	get hasCommand(): boolean {
		return this.command ? true : false;
	}

	/**
	 * returns a boolean whether the message content starts with the prefix or not
	 */
	get hasPrefix(): boolean {
		return this.message.content.startsWith(config.prefix);
	}

	/**
	 * returns a new preformatted MessageEmbed
	 */
	get embed(): MessageEmbed {
		return new MessageEmbed()
			.setAuthor(
				this.bot.user!.username,
				"https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp"
			)
			.setFooter(this.command ? this.command.wholeIdentifier! : "")
			.setColor("#49a013")
			.setTimestamp();
	}

	/**
	 * executes the current command and returns a Promise
	 */
	public async execute(): Promise<void> {
		if (!this.command) return log.logger.error(`Command does not exist`);

		log.command.setTimestamp();
		await this.message.channel.sendTyping();

		try {
			await this.command!.execution(this);
			log.command.executionSuccess(this.command!);
		} catch (err) {
			log.command.executionFailure(this.command!, err);
			this.methods.sendCustomEmbed((embed) =>
				embed
					.setDescription(
						`I failed to execute this command.${reactions.error.random()}\n`.concat(
							`If you know github and know how to use it please create a new ${hyperlink(
								"issue",
								"https://github.com/valflrt/lejardinier-typescript/issues/new"
							)} so the developer can fix the problem`
						)
					)
					.setColor("RED")
			);
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
