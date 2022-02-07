import { Message } from "discord.js";
import { inlineCode } from "@discordjs/builders";

import GuildModel from "../../features/database/models/guild";

import reactions from "../../assets/reactions";
import { randomItem } from "../../utils";
import MemberModel from "../../features/database/models/member";

/**
 * Handles database update
 * @param context generated context for current message
 */
const databaseUpdate = async (message: Message) => {
  let guildFromDB = await GuildModel.findOne({ id: message.guildId! });
  if (!guildFromDB) new GuildModel({ id: message.guildId! });

  let member = await MemberModel.findOne({
    userId: message.author.id,
    guildId: message.guildId!,
  });
  if (!member)
    member = new MemberModel({
      userId: message.author.id,
      guildId: message.guildId!,
    });

  if (!member) return;

  let currentStats = member!.stats!,
    newStats = member!.stats!;

  newStats.messageCount = currentStats.messageCount! + 1;
  newStats.xp = currentStats.xp! + 1;
  newStats.totalXp = currentStats.totalXp! + 1;

  let hasLevelUp = newStats.xp === Math.floor(5 ** 1.1 * currentStats.level!);
  if (hasLevelUp) {
    newStats.xp = 0;
    newStats.level = currentStats.level! + 1;
  }

  member.stats = newStats;

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

  await member.save();
};

export default databaseUpdate;
