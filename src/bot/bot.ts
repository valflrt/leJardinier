import { Client, ClientOptions, GuildMember, Message } from "discord.js";

import config, { secrets } from "../config";

import database /* , { userManager } */ from "./database";
import log from "./log";
import MessageInstance from "./message";

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
		this.bot!.login(secrets.token!);
		this.bot!.once("ready", this.onReady);
	}

	/**
	 * listener for event "ready"
	 */
	private onReady = async (bot: Client) => {
		try {
			await database.connect();
			log.database.connectionSuccess();
		} catch (e) {
			log.database.connectionFailed(e);
		}

		bot.user!.setActivity({
			name: `${config.prefix}help`,
			type: "WATCHING",
		});

		log.bot.connected(bot.user!.tag, bot.user!.id);

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
			// logs a message if guild or author is undefined
			return log.bot.error(
				(!message.author ? "author is undefined" : "").concat(
					!message.guild ? "guild is undefined" : ""
				)
			);

		let messageInstance = new MessageInstance(message, this.bot!);
		log.bot.message(message, messageInstance); // logs every message

		if (messageInstance.hasCommand === true) {
			messageInstance.execute();
		} else if (messageInstance.hasPrefix) {
			messageInstance.message.react("❔");
		}
	};

	private onMemberAdd = async (member: GuildMember) => {
		/*if ((await userManager.exists(member.user.id)) === false)
			userManager.add(member.user);*/
	};

	/**
	 * sets bot listeners (once bot started: prevents too early event calls)
	 */
	private setListeners() {
		this.bot!.on("messageCreate", this.onMessageCreate);
		this.bot!.on("guildMemberAdd", this.onMemberAdd);
	}
}
