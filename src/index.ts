import LeJardinier from "./bot/bot";
import log from "./bot/log";

log.logger.startupSequence();

new LeJardinier({
	intents: [
		"GUILDS",
		"GUILD_MEMBERS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILD_PRESENCES",
		"GUILD_VOICE_STATES",
		"GUILD_EMOJIS_AND_STICKERS",
	],
}).start();
