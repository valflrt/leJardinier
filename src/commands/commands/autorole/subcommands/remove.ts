import { Message, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import lejardinier from "../../../..";

import GuildModel from "../../../../features/database/models/guild";

import Command from "../../../../features/commands/classes/command";

const remove_cmd = new Command({
  name: "remove",
  description:
    "Removes the specified autorole message (you need to reply to it)",
  aliases: ["rm"],
  execution: async ({ actions, message }) => {
    let caller = await message.guild!.members.fetch(message.author.id);
    if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return actions.sendTextEmbed(
        "You do not have the permission to add the autorole ! ".concat(
          italic("You must be administrator !")
        )
      );

    let reference: Message | undefined;
    try {
      reference = await message.fetchReference();
    } catch (e) {}

    if (!reference || reference.author.id !== lejardinier.client.user?.id)
      return actions.sendTextEmbed(
        `You need to reply to the autorole message you want to remove !`
      );

    let guild = await GuildModel.findOne({ id: message.guildId! });
    if (!guild) return actions.sendTextEmbed(`Failed to find autorole !`);

    if (!guild.autorole?.some((v) => v.messageId === reference?.id))
      return actions.sendTextEmbed(
        `The message you replied to isn't an autorole message !`
      );

    guild.autorole = guild.autorole.filter(
      (v) => v.messageId !== reference?.id
    );
    await guild.save();

    if (reference.deletable) await reference.delete();

    let sent = await actions.sendTextEmbed(
      `Autorole removed successfully !\n`.concat(
        `This message will be deleted in 10 seconds`
      )
    );
    setTimeout(() => sent.message.delete(), 1e4); // waits for 10 seconds before to delete the message
    if (message.deletable) await message.delete();
  },
});

export default remove_cmd;
