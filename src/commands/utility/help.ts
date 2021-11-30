import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import {
	bold,
	hyperlink,
	inlineCode,
	quote,
	underscore,
} from "@discordjs/builders";

import CCommand from "../../lib/commandManager/classes/command";

import commandList from "..";

import reactions from "../../assets/reactions";

const commandFormat = {
	title: (command: CCommand) => `${bold(command.name)}`,
	description: (command: CCommand) =>
		`${quote(command.description)}\n`.concat(
			`${quote(bold(inlineCode(command.syntax!)))}`
		),
	fullCommand: (command: CCommand) =>
		commandFormat
			.title(command)
			.concat(`\n${commandFormat.description(command)}`),
	createFields: (commands: CCommand[]) =>
		commands.map((command) => ({
			name: `- ${commandFormat.title(command)}`,
			value: commandFormat.description(command),
		})),
};

const help = new CCommand()
	.setName("help")
	.setDescription("Display help panel")
	.setExecution(async (messageInstance) => {
		let { methods } = messageInstance;
		methods.sendTextEmbed(
			`Here is what you can do to get help:\n`
				.concat(
					commandFormat.fullCommand(
						help.commands.find((c) => c.identifier === "commands")!
					)
				)
				.concat(
					commandFormat.fullCommand(
						help.commands.find((c) => c.identifier === "command")!
					)
				)
				.concat(
					commandFormat.fullCommand(
						help.commands.find((c) => c.identifier === "website")!
					)
				)
		);
	})

	// help.commands
	.addSubcommand((c) =>
		c
			.setName("commands")
			.setDescription("Displays every available command")
			.setExecution(async (messageInstance) => {
				let { methods } = messageInstance;

				/*
				const format = (
					array: CCommand[],
					newArray: CCommand[][] = [],
					i: number = 0
				): any => {
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

				let pages: MessageEmbed[] = [];
				let i = 0;
				categories.forEach((commands, name) => {
					pages.push(
						methods.returnCustomEmbed((embed) =>
							embed
								.setDescription(
									`${bold(name)} (page ${i + 1} of ${
										categories.size
									})`
								)
								.addFields(
									commandFormat.createFields(commands!)
								)
						)
					);
					i++;
				});

				let row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("p")
						.setLabel("Previous Page")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("n")
						.setLabel("Next Page")
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
					index =
						i.customId === "n"
							? index !== categories.size - 1
								? index + 1
								: 0
							: index !== 0
							? index - 1
							: categories.size - 1;
					await i.update({ embeds: [pages[index]] });
				});

				collector.on("end", async (collected, reason) => {
					row.components.forEach((c) => c.setDisabled());
					if (reason === "time")
						await sent.editWithTextEmbed(
							`Display has timeout (1 min)`,
							{ components: [row] }
						);
					else
						await sent.editWithTextEmbed(`Display closed`, {
							components: [row],
						});
				});

				/*
				this code took so long to make that i want to keep it...
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
			})
	)

	// help.command
	.addSubcommand((c) =>
		c
			.setName("command")
			.setDescription("Get help about one command")
			.addParameter((p) => p.setName("command name").setRequired(true))
			.setExecution(async (messageInstance) => {
				let { methods, commandParameters } = messageInstance;

				if (!commandParameters)
					return methods.sendTextEmbed(
						`You need to specify the name of the command you're looking for...`
					);

				let command = commandList.get(commandParameters[0]);

				if (!command)
					return methods.sendTextEmbed(`Unknown command...`);
				else
					methods.sendCustomEmbed((embed) =>
						embed
							.setDescription(
								`${bold(commandFormat.title(command!))}\n`
									.concat(commandFormat.description(command!))
									.concat(
										command!.commands
											? `\n\n${bold(
													underscore(`Subcommands:`)
											  )}\n`
											: ""
									)
							)
							.addFields(
								commandFormat.createFields(command!.commands)
							)
					);
			})
	)

	// help.website
	.addSubcommand((c) =>
		c
			.setName("website")
			.setDescription("Get my website link")
			.setExecution(async (messageInstance) => {
				let { methods } = messageInstance;
				methods.sendTextEmbed(
					`Click ${hyperlink(
						`here`,
						`https://valflrt.github.io/lejardinier-typescript/`
					)} `.concat(
						`to get to my website ${reactions.smile.random()}`
					)
				);
			})
	);

export default help;
