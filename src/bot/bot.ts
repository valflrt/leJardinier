import { Client, ClientOptions, GuildMember, Message } from "discord.js";

import config from "../config";

import database, { userManager } from "./database";
import log from "./log";
import MessageInstance from "./message";

export default class LeJardinier {

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
		this.bot!.login(config.secrets.token);
		this.bot!.once("ready", () => this.onReady());
	}

	/**
	 * listener for event "ready"
	 */
	private onReady = async () => {

		try {
			await database.connect();
			log.database.connectionSuccess();
		} catch (e) {
			log.database.connectionFailed(e);
		}

		this.bot!.user!.setActivity({ name: `${config.prefix}help`, type: "WATCHING" });
		log.bot.connected(this.bot!.user!.tag, this.bot!.user!.id);

		this.setListeners();

	}

	/**
	 * listener for event "messageCreate"
	 * @param message {Message} message object
	 */
	private onMessageCreate = async (message: Message) => {
		log.bot.message(message); // logs every message

		let messageInstance = new MessageInstance(message, this.bot!);

		if (messageInstance.hasCommand === true) {
			messageInstance.execute();
		} else if (messageInstance.hasPrefix) {
			messageInstance.message.react("❔");
		}
	}

	private onMemberAdd = async (member: GuildMember) => {
		let { user } = member;
		if (await userManager.exists(user.id) === false)
			userManager.add(user);
	}

	/**
	 * sets bot listeners (once bot started)
	 */
	private setListeners = () => {
		this.bot!.on("messageCreate", (message) => this.onMessageCreate(message));
		this.bot!.on("guildMemberAdd", (member) => this.onMemberAdd(member));
	}

}