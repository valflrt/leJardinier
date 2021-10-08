import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

import MessageInstance from "../../bot/message";
import { linkButton } from "../../bot/interactions";

import { Command } from "../../bot/command";
import { ICommand } from "../../types";

import commandList from "..";

import reactions from "../../assets/reactions";

const help = new Command({
	name: "help",
	description: "Display help panel",
	execution: (messageInstance: MessageInstance) => {
		let { methods } = messageInstance;
		methods.sendTextEmbed(
			`You need some help ?\n`
				.concat(` - \`lj!help commands\` gives the command list\n`)
				.concat(
					` - \`lj!help command [command name]\` gives information about one command\n`
				)
				.concat(
					` - \`lj!help website\` gives the link to my website where everything you need to know is written\n`
				)
		);
	},
	commands: [
		new Command({
			name: "commands",
			description: "Displays every available command",
			execution: async (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;

				/*const format = (array: ICommand[], newArray: ICommand[][] = [], i: number = 0): any => {
					if (!newArray[i]) newArray.push([]);
		
					if (newArray[i].length !== 5)
						newArray[i].push(array.shift()!);
					else i++;
		
					if (array.length === 0) return newArray;
					else return format(array, newArray, i);
				};
				i'll keep this here as a comment because i spent a lot of time
				on it and it was painful so i don't want to just delete it T^T
				*/

				let index = 0;
				let categories = commandList.categories;

				let pages: MessageEmbed[] = categories.map((category, i) =>
					methods.returnCustomEmbed((embed: MessageEmbed) => {
						embed.setDescription(
							`**${category.name}** (page ${i + 1} of ${categories.length
							})`
						);
						let fields = category.commands.map(
							(command: ICommand) => ({
								name: `\`${command.syntax}\``,
								value: `${command.description}`,
							})
						);
						embed.addFields(...fields);
						return embed;
					})
				);

				let row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("p")
						.setLabel("Previous")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("n")
						.setLabel("Next")
						.setStyle("SECONDARY")
				);

				let sent = await methods.sendEmbed(pages[index], {
					components: [row],
				});

				let collector = sent.createMessageComponentCollector({
					filter: (button) =>
						button.customId === "p" || button.customId === "n",
					time: 60000,
				});

				collector.on("collect", async (i) => {
					if (i.user.bot) return;
					index = (i.customId === "n") ?
						((index !== categories.length - 1) ? index + 1 : 0)
						: ((index !== 0) ? index - 1 : categories.length - 1);
					await i.update({ embeds: [pages[index]] });
				});

				collector.on("end", async (collected, reason) => {
					if (reason === "time")
						await sent.editWithTextEmbed(
							`Display has timeout (1 min)`
						);
					else await sent.editWithTextEmbed(`Display closed`);
					row.spliceComponents(0, 2);
				});

				/* this code took so long to make that i want to keep it...
				
				await sent.react("⬅️");
				await sent.react("➡️");
				await sent.react("❌");

				let collector = sent.createReactionCollector({
					filter: (reaction) =>
						["⬅️", "➡️", "❌"].includes(reaction.emoji.name!),
					max: 200,
					time: 60000,
				});

				collector.on("collect", async (reaction, user) => {
					if (user.bot) return;
					if (
						reaction.emoji.name === "➡️" &&
						index !== categories.length - 1
					) {
						index = index + 1;
						await reaction.users.remove(user);
						await sent.editWithEmbed(pages[index]);
					} else if (reaction.emoji.name === "⬅️" && index !== 0) {
						index = index - 1;
						await reaction.users.remove(user);
						await sent.editWithEmbed(pages[index]);
					} else if (reaction.emoji.name === "❌") {
						return collector.stop();
					} else {
						await reaction.users.remove(user);
					}
				});

				collector.on("end", async (collected, reason) => {
					if (reason === "time")
						await sent.editWithTextEmbed(`Display has timeout (1 min)`);
					else
						await sent.editWithTextEmbed(`Display closed`);
					await sent.reactions.removeAll();
				});
				*/
			},
		}),
		new Command({
			name: "command",
			description: `Get help about one command`,
			arguments: `[command name]`,
			execution: (messageInstance: MessageInstance) => {
				let { methods, commandArgs } = messageInstance;

				if (!commandArgs)
					return methods.sendTextEmbed(
						`You need to specify the command name...`
					);

				if (!commandList.has(commandArgs))
					return methods.sendTextEmbed(`Unknown command...`);
				else
					methods.sendCustomEmbed((embed: MessageEmbed) => {
						let command = commandList.get(commandArgs!)!;

						embed.setDescription(`**\`${command.syntax}\`**
					${command.description}${command.commands ? "\n\n__**Subcommands:**__\n" : ""}`);

						command.commands?.forEach((command) =>
							embed.addField(
								`   \`${command.syntax}\``,
								`   ${command.description}`
							)
						);

						return embed;
					});
			},
		}),
		new Command({
			name: "website",
			description: `Get my website link`,
			syntax: `website`,
			execution: (messageInstance: MessageInstance) => {
				let { methods } = messageInstance;
				methods.reply({
					content: `Now you just need to click the button below to access my website ${reactions.smile.random()}`,
					components: [
						linkButton(
							"My website",
							"https://valflrt.github.io/lejardinier-typescript/"
						),
					],
				});
			},
		}),
	],
});

export default help;
