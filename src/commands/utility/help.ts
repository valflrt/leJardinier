import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import {
	bold,
	hyperlink,
	inlineCode,
	italic,
	underscore,
} from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";
import commandList from "..";

import CSubcommandPreview from "../../middlewares/formatting/subcommand";
import reactions from "../../assets/reactions";

const help = new CCommand()
	.setName("help")
	.setDescription("Display help panel")
	.setExecution(async (messageInstance) => {
		let { methods } = messageInstance;
		methods.sendCustomEmbed((embed) =>
			embed
				.setDescription(
					`Hello I'm ${bold(
						"Le Jardinier"
					)} ${reactions.smile.random()}\n`
						.concat(
							`I am an utility discord bot developed by <@${
								"564012236851511298" /* my discord id */
							}>.\n`
						)
						.concat(
							italic(
								`"le jardinier" means "the gardener" in french.\n`
							)
						)
						.concat("\n")
						.concat(`Here are some commands you can start with:`)
				)
				.addFields(CSubcommandPreview.createFields(help.commands))
		);
	})

	// help.usage
	.addSubcommand((c) =>
		c
			.setName("usage")
			.setDescription("Gives information on how to use the bot")
			.setExecution(async (messageInstance) => {
				let { methods } = messageInstance;
				methods.sendCustomEmbed((embed) =>
					embed
						.setTitle(
							underscore(
								bold(
									`Here are some instructions to be able to use me efficiently`
								)
							)
						)
						.setDescription(
							bold("1/ Command calls\n")
								.concat(
									`First, you need to know how to call a command.\n`
								)
								.concat(
									italic(
										"(yes it's dumb because you just did, but I think a reminder could help some people)"
									)
								)
								.concat("\n\n")
								.concat(
									`To do so, you will need to write: ${inlineCode(
										`[prefix][command identifier] [?parameters]`
									)}\n`
								)
								.concat(`Here are some examples:\n`)
								.concat(`• ${inlineCode("lj!hey")}\n`)
								.concat(
									`• ${inlineCode(
										"lj!morse.encode this is an example"
									)}`
								)
								.concat("\n\n")
								.concat(bold("2/ Hierarchy system\n"))
								.concat(
									`I use a specific command hierarchy system: a "dotted" hierarchy.\n`
								)
								.concat(
									`That is to say the whole "path" to a command is called a ${bold(
										"command identifier"
									)} and looks like:\n`
								)
								.concat(
									`${inlineCode(
										"[command name].[subcommand name].[sub-subcommand name].[...]"
									)}`
								)
								.concat("\n\n")
								.concat(`Examples:\n`)
								.concat(
									`• ${inlineCode(
										"morse.table"
									)} is the identifier for the subcommand "table" of the command "morse"\n`
								)
								.concat(
									`• ${inlineCode(
										"music.add.search"
									)} is the identifier for the sub-subcommand "search" of the subcommand "add" of the command "music"`
								)
						)
				);
			})
	)

	// help.commands
	.addSubcommand((c) =>
		c
			.setName("commands")
			.addAlias("cmds")
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
									CSubcommandPreview.createFields(commands)
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
					idle: 20000, // 20 seconds
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

				collector.on("end", async () => {
					row.components.forEach((c) => c.setDisabled());
					await sent.editWithTextEmbed(`The display has expired`, {
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
			.addHelpCommand()
	)

	// help.command
	.addSubcommand((c) =>
		c
			.setName("command")
			.addAlias("cmd")
			.setDescription("Get help about one command")
			.addParameter((p) => p.setName("command name").setRequired(true))
			.setExecution(async (messageInstance) => {
				let { methods, commandParameters } = messageInstance;

				if (!commandParameters)
					return methods.sendTextEmbed(
						`You need to specify the name of the command you're looking for...`
					);

				let command = commandList.find(commandParameters.split(/\./g));

				if (!command)
					return methods.sendTextEmbed(`Unknown command...`);
				else {
					methods.sendCustomEmbed((embed) =>
						embed
							.setDescription(
								new CSubcommandPreview(command!).fullPreview
							)
							.addFields(
								CSubcommandPreview.createFields(
									command!.commands
								)
							)
					);
				}
			})
			.addHelpCommand()
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
			.addHelpCommand()
	);

export default help;
