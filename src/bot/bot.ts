import { Client, ClientOptions, Message } from "discord.js";

import config from "../config";
import token from "../config/token";

import database from "./database";
import log from "./log";
import MessageInstance from "./message";

class LeJardinier {

	private bot?: Client;

	/**
	 * Creates client object
	 * @param options {ClientOptions}
	 * @returns {LeJardinier} this
	 */
	public init = (options: ClientOptions): LeJardinier => {
		this.bot = new Client(options);
		return this;
	};

	/**
	 * makes the client login and sets function for event "ready" (= starts the bot)
	 */
	public start = () => {
		log.bot.starting();
		this.bot!.login(token!);
		this.bot!.once("ready", () => this.onReady());
	}

	/**
	 * listener for event "ready"
	 */
	private async onReady() {

		try {
			await database.connect();
			log.database.connectionSuccess();
		} catch (e) {
			log.database.connectionFailed(e);
		}

		this.bot!.user!.setActivity({ name: `${config.prefix}help`, type: "WATCHING" });
		log.bot.connected(this.bot!.user!.tag, this.bot!.user!.id);

		this.bot!.on("messageCreate", (message) => this.onMessageCreate(message));

	}

	/**
	 * listener for event "messageCreate"
	 * @param message {Message} message object
	 */
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