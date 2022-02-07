import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import Command from "../../../../features/commands/classes/command";
import GuildModel from "../../../../features/database/models/guild";

const add_cmd = new Command({
  name: "add",
  description:
    "Adds an autorole message replying to a specific message if specified (you need to reply to the message)",
  parameters: [{ name: "role mention", required: true }],
  execution: async ({ actions, message }) => {
    /**
     * Finds the user who requested the autorole creation and checks if they are an admin
     */
    let caller = await message.guild!.members.fetch(message.author.id);
    if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return actions.sendTextEmbed(
        "You do not have the permission to add the autorole ! ".concat(
          italic("You must be administrator !")
        )
      );

    /**
     * Finds roles to automatically add
     */
    let roles = message.mentions.roles;
    if (!roles || roles.size === 0)
      return actions.sendTextEmbed(
        "You need to specify the role which will be given to members !"
      );

    /**
     * Creates the reply to send
     */
    let reply = {
      embeds: [
        actions.returnTextEmbed(
          `Click the button below to receive the following roles: ${roles
            .map((v) => v.toString())
            .join(" ")}`
        ),
      ],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton()
              .setStyle("PRIMARY")
              .setCustomId("autorole")
              .setLabel(`Get role${roles.size !== 0 ? "s" : ""}`),
          ],
        }),
      ],
    };

    /**
     * Fetches reference
     */
    let reference;
    try {
      reference = await message.fetchReference();
    } catch (e) {}

    /**
     * If a message reference is found, replies to it, else sends a message in the channel
     */
    let sent = reference
      ? await reference.reply(reply)
      : (await actions.send(reply)).message;

    let guild = await GuildModel.findOne({ id: message.guildId! });
    if (!guild) return actions.sendTextEmbed(`Failed to save autorole !`);

    /**
     * Adds the autorole object to database
     */
    guild.autorole!.push({
      messageId: sent.id,
      channelId: message.channelId,
      roleIds: roles.map((v) => v.id),
    });
    await guild.save();

    /**
     * Deletes message sent by the user
     */
    await message.delete();
  },
});

export default add_cmd;
