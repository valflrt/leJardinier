import { MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { Command, CommandType } from "../../bot/command";

import { display } from "..";

const help = new Command({
	name: "help",
	description: "displays every available command",
	syntax: `help`,
	execution: async (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;

		/*const format = (array: CommandType[], newArray: CommandType[][] = [], i: number = 0): any => {
			if (!newArray[i]) newArray.push([]);

			if (newArray[i].length !== 5)
				newArray[i].push(array.shift()!);
			else i++;

			if (array.length === 0) return newArray;
			else return format(array, newArray, i);
		};
		i'll keep this here as a comment cuz i spent a lot of time
		on it and it was painful so i don't want to just delete it T^T
		*/

		let index = 0;

		let generatePage = (embed: MessageEmbed) => {
			let currentPage = display.categories[index];
			embed.setDescription(`**${currentPage.name}** (page ${index + 1} of ${display.categories.length})`);
			currentPage.commands.forEach((command: CommandType) =>
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
			if (user.bot) return;
			if (reaction.emoji.name === "➡️" && index !== display.categories.length - 1) {
				index = index + 1;
				await reaction.users.remove(user);
				await sent.edit({ embeds: [methods.returnCustomEmbed(generatePage)] });
			} else if (reaction.emoji.name === "⬅️" && index !== 0) {
				index = index - 1;
				await reaction.users.remove(user);
				await sent.edit({ embeds: [methods.returnCustomEmbed(generatePage)] });
			} else if (reaction.emoji.name === "❌") {
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
})

export default help;