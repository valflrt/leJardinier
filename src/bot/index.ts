import { Client, Message } from "discord.js";

import config from "../config";
import token from "../config/token";

import * as log from "./log";
import MessageInstance from "./message";

class LeJardinier {

	private bot: Client;

	constructor() {
		this.bot = new Client({
			intents: [
				"GUILDS",
				"GUILD_MEMBERS",
				"GUILD_MESSAGES",
				"GUILD_MESSAGE_REACTIONS",
				"GUILD_PRESENCES",
				"GUILD_VOICE_STATES",
				"GUILD_EMOJIS_AND_STICKERS"
			]
		});

		this.bot.on("ready", async () => this.onReady());
		this.bot.on("messageCreate", async (message) => this.onMessageCreate(message));

		this.bot.login(token!);
	}

	private onReady() {
		this.bot.user!.setActivity(`${config.prefix}help`, { type: "COMPETING" });
		log.bot.connected(this.bot.user!.tag, this.bot.user!.id);
	}

	private async onMessageCreate(message: Message) {
		log.bot.message(message);

		let messageInstance = new MessageInstance(message, this.bot);

		if (messageInstance.hasCommand) {
			messageInstance.command!.execute(messageInstance);
		}
	}

	/**
	 * useless function
	 */
	public start = () => { };

}

export default new LeJardinier();