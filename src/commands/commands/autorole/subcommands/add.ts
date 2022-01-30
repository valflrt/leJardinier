import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import Command from "../../../../features/commands/classes/command";

import database from "../../../../features/database";

const add_cmd = new Command({
  name: "add",
  description:
    "Adds an autorole message replying to a specific message if specified (you need to reply to the message)",
  parameters: [{ name: "role mention", required: true }],
  execution: async ({ actions, message }) => {
    let caller = await message.guild!.members.fetch(message.author.id);
    if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return actions.sendTextEmbed(
        "You do not have the permission to add the autorole ! ".concat(
          italic("You must be administrator !")
        )
      );

    let roleMention = message.mentions.roles.first();
    if (!roleMention)
      return actions.sendTextEmbed(
        "You need to specify the role which will be given to members !"
      );

    let reply = {
      embeds: [
        actions.returnTextEmbed(
          `Click the button below to receive the ${roleMention.toString()} role`
        ),
      ],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton()
              .setStyle("PRIMARY")
              .setCustomId("autorole")
              .setLabel("Get role"),
          ],
        }),
      ],
    };

    let reference;
    try {
      reference = await message.fetchReference();
    } catch (e) {}

    let sent = reference
      ? await reference.reply(reply)
      : (await actions.send(reply)).message;

    let guild = await database.guilds.findOne({ id: message.guildId! });
    if (!guild) return actions.sendTextEmbed(`Failed to save autorole !`);

    guild.autorole?.push({
      messageId: sent.id,
      channelId: message.channelId,
      roleId: roleMention.id,
    });
    await database.guilds.updateOne({ id: message.guildId! }, guild);

    await message.delete();
  },
});

export default add_cmd;
