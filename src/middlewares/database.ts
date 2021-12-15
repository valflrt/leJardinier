import { Message } from "discord.js";

import database from "../managers/database";

export const onMessage = async (message: Message) => {
	let update = await database.users.updateStats(
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

	if (update === "ug") await database.guilds.add({ id: message.guildId! });
	if (update === "uu")
		await database.users.add(message.guildId!, {
			id: message.author.id,
		});

	onMessage(message);
};
