import { Client, Message, MessageEmbed } from "discord.js";

import commands from "../commands/index";
import { CommandType } from "./command";
import ReplyMethods from "./methods";
import config from "../config";
import log from "./log";

class MessageInstance {

	public message: Message;
	public bot: Client;

	public methods: ReplyMethods;
	public command: CommandType | undefined;
	public commandArgs: string | undefined;

	public hasCommand: boolean;
	public hasPrefix: boolean;

	constructor(message: Message, bot: Client) {
		this.message = message;
		this.bot = bot;

		this.command = this.getCommand();
		this.hasCommand = this.command ? true : false;
		this.hasPrefix = this.message.content.startsWith(config.prefix);

		if (this.hasCommand) this.commandArgs = this.message.content
			.replace(new RegExp(`^${config.prefix}${this.command!.name}`, "g"), "")
			.trim();

		this.methods = new ReplyMethods(this);
	}

	private getCommand = (): CommandType | undefined => {
		let command = commands.find(this.message.content);
		return command;
	}

	public generateEmbed = (): MessageEmbed => new MessageEmbed()
		.setAuthor(this.bot.user!.username, "https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp")
		.setFooter(this.command ? `${config.prefix}${this.command.name}` : "")
		.setTimestamp()
		.setColor("#49a013");

	public execute = async () => {
		try {
			await this.command!.execution(this);
			log.command.executed(this.command!);
		} catch (err) {
			log.command.executionFailed(this.command!, err);
		}
	}

}

export default MessageInstance;