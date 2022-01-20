import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import CCommand from "../../../../managers/commands/classes/command";

import database from "../../../../features/databaseManager";

const set = new CCommand()
  .setName("set")
  .setDescription(
    "Adds a watcher on a message".concat(
      "When a specific mention is added by a member, they get a specific role"
    )
  )
  .addParameter((p) => p.setName("role mention").setRequired(true))
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;

    let guildFromDB = await database.guilds.findOne({
      id: message.guildId!,
    });
    if (guildFromDB?.autorole)
      return methods.sendTextEmbed(
        "There already is an autorole watcher set !\n".concat(
          `Use if you want to remove the existing one take a look at the subcommands.`
        )
      );

    let caller = await message.guild!.members.fetch(message.author.id);
    if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return methods.sendTextEmbed(
        "You do not have the permission to add the autorole !\n".concat(
          italic("You must be administrator")
        )
      );

    let roleMention = message.mentions.roles.first();
    if (!roleMention)
      return methods.sendTextEmbed(
        "You need to specify the role to add automatically !"
      );

    let reply = {
      embeds: [
        methods.returnTextEmbed(
          `Click the button below to receive the role: ${roleMention.toString()}`
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

    let reference = await message.fetchReference();
    let sent = reference
      ? await reference.reply(reply)
      : await message.reply(reply);

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
  });

export default set;
