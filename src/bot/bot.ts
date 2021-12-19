import { Client, ClientOptions, GuildMember, Message } from "discord.js";

import MessageInstance from "./message";

import database, { buildDatabase } from "../managers/database";
import databaseMiddleware from "../middlewares/database";

import log from "./log";

import config from "../config";

export default class LeJardinier {
	private bot?: Client;

	/**
	 * Creates client object
	 * @param options client options
	 */
	constructor(options: ClientOptions) {
		this.bot = new Client(options);
	}

	/**
	 * makes the client login and sets function for event "ready" (= starts the bot)
	 */
	public start() {
		this.bot!.login(config.secrets.token!);
		this.bot!.once("ready", this.onReady);
	}

	/**
	 * listener for event "ready"
	 */
	private onReady = async (bot: Client) => {
		try {
			await buildDatabase();
			log.database.connectionSuccess();
		} catch (e) {
			log.database.connectionFailure(e);
		}

		bot.user!.setActivity({
			name: `${config.local.prefix}help`,
			type: "WATCHING",
		});

		log.logger.connectionSuccess(bot.user!.tag, bot.user!.id);

		this.setListeners();
	};

	/**
	 * listener for event "messageCreate"
	 * @param message message object
	 */
	private onMessageCreate = async (message: Message) => {
		// checks if something is wrong with the message
		if (message.author.bot) return; // skip if the author is a bot
		if (!message.author || !message.guild)
			// logs an error if guild or author is undefined
			return log.logger.error(
				(!message.author ? "author is undefined" : "").concat(
					!message.guild ? "guild is undefined" : ""
				)
			);

		let messageInstance = new MessageInstance(message, this.bot!);

		databaseMiddleware.listeners.onMessage(messageInstance);

		if (!message.content.startsWith(config.local.prefix)) return;
		log.message.message(message, messageInstance); // logs every command

		if (messageInstance.hasCommand === true) {
			messageInstance.execute();
		} else if (messageInstance.hasPrefix) {
			messageInstance.message.react("❔");
		}
	};

	private onMemberAdd = async (member: GuildMember) => {
		let foundMember = await database.members.findOne({
			userId: member.id,
			guildId: member.guild.id,
		});
		if (!foundMember)
			await database.members.createOne({
				userId: member.id,
				guildId: member.guild.id,
			});
	};

	/**
	 * sets bot listeners (once bot started: prevents too early event calls and
	 * error resulting of it)
	 */
	private setListeners() {
		this.bot!.on("messageCreate", this.onMessageCreate);
		this.bot!.on("guildMemberAdd", this.onMemberAdd);
		this.bot!.on("interactionCreate", (i) => {
			// TODO: use this for command autorole
			i.isButton();
			console.log(i);
		});
	}
}
