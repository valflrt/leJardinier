import { MessageEmbed } from "discord.js";

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
		methods.sendEmbed(
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
				i'll keep this here as a comment cuz i spent a lot of time
				on it and it was painful so i don't want to just delete it T^T
				*/

				let index = 0;
				let categories = commandList.categories;

				let pages: MessageEmbed[] = categories.map((category, i) =>
					methods.returnCustomEmbed((embed: MessageEmbed) => {
						embed.setDescription(
							`**${category.name}** (page ${i + 1} of ${
								categories.length
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

				let sent = await methods.reply({ embeds: [pages[index]] });

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
						await sent.edit({ embeds: [pages[index]] });
					} else if (reaction.emoji.name === "⬅️" && index !== 0) {
						index = index - 1;
						await reaction.users.remove(user);
						await sent.edit({ embeds: [pages[index]] });
					} else if (reaction.emoji.name === "❌") {
						return collector.stop();
					} else {
						await reaction.users.remove(user);
					}
				});

				collector.on("end", async (collected, reason) => {
					if (reason === "time")
						await sent.edit({
							embeds: [
								methods.returnEmbed(
									`Display has timeout (1 min)`
								),
							],
						});
					else
						await sent.edit({
							embeds: [methods.returnEmbed(`Display closed`)],
						});
					await sent.reactions.removeAll();
				});
			},
		}),
		new Command({
			name: "command",
			description: `Get help about one command`,
			arguments: `[command name]`,
			execution: (messageInstance: MessageInstance) => {
				let { methods, commandArgs } = messageInstance;

				if (!commandArgs)
					return methods.sendEmbed(
						`You need to specify the command name...`
					);

				if (!commandList.has(commandArgs))
					return methods.sendEmbed(`Unknown command...`);
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
