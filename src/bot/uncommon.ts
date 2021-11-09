/**
 * will be used when the bot needs to do something that
 * can't be done with common functions and features
 */

import { Client, TextChannel } from "discord.js";

export const start = (bot: Client) => {
	setInterval(() => {
		let time = new Date();
		if (time.getHours() === time.getMinutes()) {
			let channel = bot.channels.cache.get(
				"802634814771560518"
			) as TextChannel;
			channel.send("<@&802634842557644900> Hurry up !");
		}
	}, 5000);
};
