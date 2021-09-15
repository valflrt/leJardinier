import chalk from "chalk";

import LeJardinier from "./bot/bot";
import log from "./bot/log";

log.logger.clear();

log.logger.write(` ${chalk.hex("#abf7a7").bold`Le Jardinier`} 🍀 ${chalk.rgb(200, 220, 210).italic`v2.1`}
${chalk.rgb(200, 220, 210)(`   by valflrt`)}`);
log.logger.newLine(2);

new LeJardinier()
	.init({
		intents: [
			"GUILDS",
			"GUILD_MEMBERS",
			"GUILD_MESSAGES",
			"GUILD_MESSAGE_REACTIONS",
			"GUILD_PRESENCES",
			"GUILD_VOICE_STATES",
			"GUILD_EMOJIS_AND_STICKERS"
		]
	})
	.start();