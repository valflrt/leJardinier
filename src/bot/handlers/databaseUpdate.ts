import { Message } from "discord.js";
import { inlineCode } from "@discordjs/builders";

import database from "../../features/database";
import { randomItem } from "../../utils";

import reactions from "../../assets/reactions";

/**
 * Handles database update
 * @param context generated context for current message
 */
const databaseUpdate = async (message: Message) => {
  let doc = { id: message.guildId! };
  await database.guilds.findOrCreateOne(doc, doc);

  let member = await database.members.findOrCreateOne(
    {
      userId: message.author.id,
      guildId: message.guildId!,
    },
    {
      userId: message.author.id,
      guildId: message.guildId!,
    }
  );

  if (!member) return;

  let currentStats = member!.stats!,
    newStats = member!.stats!;

  newStats.messageCount = currentStats.messageCount! + 1;
  newStats.xp = currentStats.xp! + 1;

  let hasLevelUp = newStats.xp === Math.floor(5 ** 1.1 * currentStats.level!);
  if (hasLevelUp) {
    newStats.xp = 0;
    newStats.level = currentStats.level! + 1;
  }

  await database.members.updateOne(
    {
      userId: message.author.id,
      guildId: message.guildId!,
    },
    {
      stats: newStats,
    }
  );

  if (hasLevelUp) {
    message.channel.send(
      `${randomItem(
        "Congratulations",
        "Well done",
        "Yay"
      )} ${message.author.toString()} ! `.concat(
        `You just leveled up to level ${inlineCode(
          newStats.level!.toString()
        )} ${reactions.smile.random}`
      )
    );
  }
};

export default databaseUpdate;
