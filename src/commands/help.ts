import { MessageEmbed, ReactionCollectorOptions } from "discord.js";
import MessageInstance from "../bot/message";
import { Command } from "../types";
import commands from ".";

const help: Command = {
	name: "help",
	description: "Get help",
	syntax: `help`,
	execute: (messageInstance: MessageInstance) => {
		let { methods, message } = messageInstance;

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

		let loadPage = (embed: MessageEmbed) => {
			embed.addField(`Page: `, `${index + 1}/${formatted.length}`, true);
			formatted[index].forEach((command: Command) =>
				embed.addField(`${command.syntax}`, `${command.description}`)
			);
			return embed;
		};

		methods.sendCustomEmbed(loadPage)
			.then(async (sent) => {
				await sent.react("⬅️");
				await sent.react("➡️");
				await sent.react("❌");
				let collector = sent.createReactionCollector({ filter: (reaction) => ["⬅️", "➡️", "❌"].includes(reaction.emoji.name!), max: 200, time: 60000 });
				collector.on("collect", async (reaction, user) => {
					if (reaction.emoji.name === "➡️" && index + 1 !== formatted.length) {
						index++;
						await reaction.users.remove(user);
						await sent.edit(methods.returnCustomEmbed(loadPage));
					} else if (reaction.emoji.name === "⬅️" && index !== 0) {
						index--;
						await reaction.users.remove(user);
						await sent.edit(methods.returnCustomEmbed(loadPage));
					} else if (reaction.emoji.name === "❌") {
						return collector.stop("Display closed by user");
					} else {
						await reaction.users.remove(user);
					};
				});
				collector.on("end", async (collected, reason) => {
					console.log(reason);
					if (reason === "time") await sent.edit({
						embeds: [methods.returnEmbed(`Display has timeout (1 min)`)]
					});
					else await sent.edit({
						embeds: [methods.returnEmbed(`Display closed`)]
					});
					await sent.reactions.removeAll();
				});
			}).catch(err => console.log(err));

	}
};

export default help;