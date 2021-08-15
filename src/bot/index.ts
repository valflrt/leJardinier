import Discord from "discord.js";
import config from "../config";
import token from "../config/token";

import * as log from "./log";

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

		this.bot.on("ready", async () => this.onReady());
		this.bot.on("messageCreate", async (message) => this.onMessageCreate(message));

		this.bot.login(token!);
	}

	private onReady() {
		this.bot.user?.setActivity(`${config.prefix}help`, { type: "COMPETING" });
		log.bot.connected(this.bot.user!.tag);
	}

	private onMessageCreate(message: Discord.Message) {
		log.bot.message(message);
	}

	/**
	 * useless function
	 */
	public start = () => { };

}

export default new LeJardinier();