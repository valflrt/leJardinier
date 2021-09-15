import { Client, Message } from "discord.js";

import config from "../config";
import token from "../config/token";

import database from "./database";
import log from "./log";
import MessageInstance from "./message";

class LeJardinier {

	private bot?: Client;

	/**
	 * start bot
	 */
	public start = () => {
		this.bot! = new Client({
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

		this.bot.once("ready", () => this.onReady());
		this.bot.on("messageCreate", (message) => this.onMessageCreate(message));

		this.bot.login(token!);
	};

	private async onReady() {

		log.bot.starting();

		try {
			await database.connect();
			log.database.connectionSuccess();
		} catch (e) {
			log.database.connectionFailed(e);
		}

		this.bot!.user!.setActivity({ name: `${config.prefix}help`, type: "WATCHING" });
		log.bot.connected(this.bot!.user!.tag, this.bot!.user!.id);

	}

	private async onMessageCreate(message: Message) {
		log.bot.message(message); // logs every message

		let messageInstance = new MessageInstance(message, this.bot!);

		if (messageInstance.hasCommand === true) {
			messageInstance.execute();
		} else if (messageInstance.hasPrefix) {
			messageInstance.message.react("❔");
		}
	}

}

export default LeJardinier;