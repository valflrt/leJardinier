import { inlineCode } from "@discordjs/builders";

import MessageInstance from "../bot/message";

import database from "../managers/database";
import { randomItem } from "../utils";

import reactions from "../assets/reactions";
import { Interaction } from "discord.js";

const onMessage = async (messageInstance: MessageInstance) => {
  let { methods, message } = messageInstance;

  let member = await database.members.findOne({
    userId: message.author.id,
    guildId: message.guildId!,
  });

  if (!member) {
    await database.members.createOne({
      userId: message.author.id,
      guildId: message.guildId!,
    });
    member = await database.members.findOne({
      userId: message.author.id,
      guildId: message.guildId!,
    });
  }

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
    methods.send(
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

const onInteraction = async (i: Interaction) => {
  if (i.isButton() && i.customId === "autorole") {
    let guild = await database.guilds.findOne({ id: i.guildId });
    if (!guild?.autorole || guild.autorole.messageId !== i.guildId) return;
    (await i.guild!.members.fetch(i.user.id)).roles.add(guild.autorole.roleId);
  }
};

const databaseMiddleware = {
  listeners: {
    onMessage,
    onInteraction,
  },
};

export default databaseMiddleware;
