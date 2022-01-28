import { Client, GuildMember, Interaction, Message } from "discord.js";

import Context from "./context";

import database, { connectDatabase } from "../features/database";

import handlers from "./handlers";
import log from "./log";

import config from "../config";

const listeners = {
  /**
   * listener for event "ready"
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
   * listener for event "messageCreate"
   * @param message message object
   */
  onMessageCreate: async (message: Message) => {
    // checks if something is wrong with the message
    if (message.author.bot) return; // skip if the author is a bot
    if (!message.author || !message.guild)
      // logs an error if guild or author is undefined
      return log.logger.error(
        (!message.author ? "author is undefined" : "").concat(
          !message.guild ? "guild is undefined" : ""
        )
      );

    let context = new Context(message);

    handlers.databaseUpdate(context);

    if (!message.content.startsWith(config.prefix)) return;
    log.message.message(message, context); // logs every command

    if (context.hasCommand === true) {
      context.execute();
    } else if (context.hasPrefix) {
      context.message.react("❔");
    }
  },

  onInteractionCreate: (i: Interaction) => {
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
