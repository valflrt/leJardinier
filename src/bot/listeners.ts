import { Client, GuildMember, Interaction, Message } from "discord.js";

import Context from "./context";

import database, { connectDatabase } from "../features/database";

import handlers from "./handlers";
import log from "./log";

import config from "../config";

const listeners = {
  /**
   * Listener for event "ready"
   */
  onReady: async (bot: Client) => {
    try {
      await connectDatabase();
      log.database.connectionSuccess();
    } catch (e) {
      log.database.connectionFailure(e);
    }

    bot.user!.setActivity({
      name: `${config.prefix}help`,
      type: "WATCHING",
    });

    log.logger.connectionSuccess(bot.user!.tag, bot.user!.id);
  },

  /**
   * Listener for event "messageCreate"
   * @param message message object
   */
  onMessageCreate: async (message: Message) => {
    if (message.author.bot) return; // skips if the author is a bot
    if (!message.author || !message.guild) return; // skips if guild or author are undefined

    await handlers.databaseUpdate(message);

    if (!message.content.startsWith(config.prefix)) return;

    let context = new Context(message);
    log.message.message(message, context); // logs every command

    if (context.hasCommand === true) {
      context.execute();
    } else if (context.hasPrefix) {
      context.message.react("❔");
    }
  },

  onInteractionCreate: (i: Interaction) => {
    if (i.isButton() && i.guildId && i.customId === "autorole")
      handlers.autoroleHandler(i);
  },

  onMemberAdd: async (member: GuildMember) => {
    let doc = {
      userId: member.id,
      guildId: member.guild.id,
    };
    database.members.updateOrCreateOne(doc, doc, doc);
    /**
     * that came right to mind
     * - doc ! doc ! doc !
     * - who's that ?
     * - it's a document ehe
     */
  },
};

export default listeners;
