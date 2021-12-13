import { Message } from "discord.js";

import database from "./database";

export const onMessage = (message: Message) => {
	database.users.updateStats(
		message.guildId!,
		message.author.id,
		(currentStats) => {
			/**
			 * Math.floor(5 ** 1.1) is the first level cost
			 * it increments with every level increase
			 */
			let currentLevelXPCost = Math.floor(5 ** 1.1 * currentStats.level!);
			let hasLeveledUp = currentStats.xp! + 1 === currentLevelXPCost;
			return {
				messageCount: currentStats.messageCount! + 1,
				xp: hasLeveledUp ? 0 : currentStats.xp! + 1,
				level: hasLeveledUp
					? currentStats.level! + 1
					: currentStats.level!,
			};
		}
	);
};
