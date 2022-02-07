import { MessageAttachment } from "discord.js";

import MemberModel from "../../features/database/models/member";

import Command from "../../features/commands/classes/command";
import UserStats from "../../features/userStats";

const rank_cmd = new Command({
  name: "rank",
  description: "Gives your stats/rank or the ones of the mentioned member",
  parameters: [{ name: "member mention", required: false }],
  execution: async ({ actions, message }) => {
    let memberMention = message.mentions.members?.first();

    let member = memberMention?.user ?? message.author;

    let memberFromDB = await MemberModel.findOne({
      userId: member.id,
      guildId: message.guildId!,
    });

    if (!memberFromDB?.stats)
      return actions.sendTextEmbed(`Couldn't find user stats !`);

    let preview = await new UserStats(
      member,
      memberFromDB.stats,
      message.guildId!
    ).generatePreview();

    actions.send({
      files: [new MessageAttachment(preview.toBuffer(), "stats.png")],
      embeds: [
        actions.returnCustomEmbed((embed) =>
          embed.setImage("attachment://stats.png")
        ),
      ],
    });
  },
});

export default rank_cmd;
