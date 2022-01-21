import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { bold } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";

import commandList from "../../..";

const commands_cmd = new CCommand()
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
              `${bold(name)} (page ${i + 1} of ${categories.size})`
            )
            .addFields(methods.formatters.CommandPreview.createFields(commands))
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
      filter: (button) => button.customId === "p" || button.customId === "n",
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
  .addHelpCommand();

export default commands_cmd;
