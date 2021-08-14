import Discord from "discord.js";
import token from "../config/token";

import log from "./log";

class LeJardinier {

	private bot: Discord.Client;

	constructor() {
		this.bot = new Discord.Client({
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

		this.bot.on("ready", () => this.onReady());
		this.bot.on("messageCreate", (message) => this.onMessageCreate(message));

		this.bot.login(token!);
	}

	private onReady() {
		log.bot.connected(this.bot.user!.tag);
	}

	private onMessageCreate(message: Discord.Message) {
		log.logger.write("new message");
		log.bot.message(message);
	}

	/**
	 * useless function
	 */
	public start = () => { };

}

export default new LeJardinier();