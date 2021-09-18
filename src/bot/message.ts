import { Client, Message, MessageEmbed } from "discord.js";

import { ICommand } from "../types";

import { guildManager, userManager, statManager } from "./database";
import ReplyMethods from "./methods";
import commands from "../commands/index";

import config from "../config";
import log from "./log";

class MessageInstance {

	public message: Message;
	public bot: Client;

	public methods: ReplyMethods;
	public command: ICommand | undefined;
	public commandArgs: string | undefined;

	public hasCommand: boolean;
	public hasPrefix: boolean;

	constructor(message: Message, bot: Client) {
		this.message = message;
		this.bot = bot;

		this.command = commands.altFind(this.message.content);
		this.hasCommand = this.command ? true : false;
		this.hasPrefix = this.message.content.startsWith(config.prefix);

		if (this.hasCommand) this.commandArgs = this.message.content
			.replace(new RegExp(`^${config.prefix}.+${this.command!.name}`, "g"), "")
			.trim();

		this.methods = new ReplyMethods(this);

		this.finish();
	}

	public generateEmbed = (): MessageEmbed => new MessageEmbed()
		.setAuthor(this.bot.user!.username, "https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp")
		.setFooter(this.command ? this.command.syntax! : "")
		.setTimestamp()
		.setColor("#49a013");

	public execute = async () => {
		this.message.channel.sendTyping();
		log.command.startTimer();
		try {
			await this.beforeExecute();
			await this.command!.execution(this);
			log.command.executed(this.command!);
		} catch (err) {
			log.command.executionFailed(this.command!, err);
		}
	}

	private beforeExecute = async () => {
		let guildExists = await guildManager.exists(this.message.guild!.id);
		if (this.command!.requiresDB === true && guildExists === false)
			this.methods.sendEmbed(`This command requires registering the guild
				Use \`${commands.get("register")!.syntax}\` for more information.`);
	}

	private finish = async () => {

		let { author, guild } = this.message;

		if (this.message.author.bot) return;
		if (!author || !guild) return console.log("problem with message.author or message.guild");

		if (await userManager.exists(author.id) === false) {
			userManager.add(author)
				.then(() => log.database.userAddedSuccessfully())
				.catch(e => log.database.failedToAddUser(e));
		}

		if (await statManager.exists(author.id, guild!.id) === false) {
			statManager.add({ userId: author.id, guildId: guild!.id })
				.then(() => log.database.statAddedSuccessfully())
				.catch(e => log.database.failedToAddStat(e));
		} else {
			let stat = await statManager.find(author.id, guild!.id);
			if (!stat) return;
			stat!.messageCount! += 1;
			stat!.save();
		}

	}

}

export default MessageInstance;