import { Message, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import lejardinier from "../../../..";

import Command from "../../../../features/commands/classes/command";

import database from "../../../../features/database";

const remove_cmd = new Command({
  name: "remove",
  description:
    "Removes the specified autorole message (you need to reply to it)",
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

    let guild = await database.guilds.findOne({ id: message.guildId! });
    if (!guild) return actions.sendTextEmbed(`Failed to find autorole !`);

    if (!guild.autorole?.some((v) => v.messageId === reference?.id))
      return actions.sendTextEmbed(
        `The message you replied to isn't an autorole message !`
      );

    guild.autorole = guild.autorole?.filter(
      (v) => v.messageId === reference?.id
    );
    await database.guilds.updateOne({ id: message.guildId! }, guild);

    if (reference.deletable) await reference.delete();
    await message.delete();
  },
});

export default remove_cmd;
