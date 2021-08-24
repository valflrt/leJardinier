import { MessageEmbed } from "discord.js";

import MessageInstance from "../bot/message";
import { Command } from "../types";

import commands from ".";

const help: Command = {
	name: "help",
	description: "Get help",
	syntax: `help`,
	execution: async (messageInstance: MessageInstance) => {
		let { methods, bot } = messageInstance;

		const format = (array: Command[], newArray: Command[][] = [], i: number = 0): any => {
			if (!newArray[i]) newArray.push([]);

			if (newArray[i].length !== 5)
				newArray[i].push(array.shift()!);
			else i++;

			if (array.length === 0) return newArray;
			else return format(array, newArray, i);
		};

		let formatted = format(commands.toArray());
		let index = 0;

		let generatePage = (embed: MessageEmbed) => {
			embed.addField(`Page: `, `${index + 1}/${formatted.length}`, true);
			formatted[index].forEach((command: Command) =>
				embed.addField(`${command.syntax}`, `${command.description}`)
			)
			return embed;
		}

		let sent = await methods.sendCustomEmbed(generatePage);

		await sent.react("⬅️");
		await sent.react("➡️");
		await sent.react("❌");

		let collector = sent.createReactionCollector({ filter: (reaction) => ["⬅️", "➡️", "❌"].includes(reaction.emoji.name!), max: 200, time: 60000 });

		collector.on("collect", async (reaction, user) => {
			if (reaction.emoji.name === "➡️" && index !== formatted.length - 1) {
				index++;
				await reaction.users.remove(user);
				await sent.edit(methods.returnCustomEmbed(generatePage));
			} else if (reaction.emoji.name === "⬅️" && index !== 0) {
				index--;
				await reaction.users.remove(user);
				await sent.edit(methods.returnCustomEmbed(generatePage));
			} else if (reaction.emoji.name === "❌" && reaction.client.user?.bot) {
				return collector.stop();
			} else {
				await reaction.users.remove(user);
			}
		})

		collector.on("end", async (collected, reason) => {
			if (reason === "time") await sent.edit({
				embeds: [methods.returnEmbed(`Display has timeout (1 min)`)]
			})
			else await sent.edit({
				embeds: [methods.returnEmbed(`Display closed`)]
			})
			await sent.reactions.removeAll();
		})

	}
}

export default help;