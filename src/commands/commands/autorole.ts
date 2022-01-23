import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import CCommand from "../../features/commands/classes/command";

import database from "../../features/database";

const autorole_cmd = new CCommand()
  .setName("autorole")
  .setDescription(
    "Adds an autorole watcher on the replied message (if specified).\n".concat(
      "When a member clicks the button, they get a specific role"
    )
  )
  .addParameter((p) => p.setName("role mention").setRequired(true))
  .setExecution(async ({ message }) => {
    let caller = await message.guild!.members.fetch(message.author.id);
    if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.sendTextEmbed(
        "You do not have the permission to add the autorole ! ".concat(
          italic("You must be administrator !")
        )
      );

    let roleMention = message.mentions.roles.first();
    if (!roleMention)
      return message.sendTextEmbed(
        "You need to specify the role which will be given to members !"
      );

    let reply = {
      embeds: [
        message.returnTextEmbed(
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
      : await message.send(reply);

    let toAdd = {
      messageId: sent.id,
      channelId: message.channelId,
      roleId: roleMention.id,
    };

    await database.guilds.updateOrCreateOne(
      { id: message.guildId! },
      {
        autorole: toAdd,
      },
      { id: message.guildId!, autorole: toAdd }
    );

    await message.delete();
  })
  .addHelpCommand();

export default autorole_cmd;
