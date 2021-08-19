import { Client, Message, MessageEmbed } from "discord.js";

import commands from "../commands/commands";
import ReplyMethods from "./methods";
import { Command } from "../types";

class MessageInstance {

	public message: Message;
	public bot: Client;
	public methods: ReplyMethods;

	public command: Command;
	public embed: MessageEmbed;

	constructor(message: Message, bot: Client) {
		this.message = message;
		this.bot = bot;
		this.methods = new ReplyMethods(this);

		this.command = this.getCommand();
		this.embed = this.setEmbed();
	}

	private getCommand = () => commands.find(this.message.content);

	private setEmbed = (): MessageEmbed => new MessageEmbed()
		.setAuthor(this.bot.user!.username, "https://media.discordapp.net/attachments/749765499998437489/823241819801780254/36fb6d778b4d4a108ddcdefb964b3cc0.webp")
		.setFooter(`${new Date().toLocaleString()} - Answering ${this.message.author.tag} - ${this.command.name}`)
		.setColor("#49a013");

};

export default MessageInstance;