import { Interaction } from "discord.js";

import database from "../../features/database";
import reactions from "../../assets/reactions";

const autoroleHandler = async (i: Interaction) => {
  if (i.isButton() && i.customId === "autorole" && i.guildId) {
    let guild = await database.guilds.findOne({ id: i.guildId! });
    if (!guild?.autorole || i.message.id !== guild.autorole.messageId)
      return i.reply({ content: `Failed to issue role !`, ephemeral: true });
    (await i.guild!.members.fetch(i.user.id)).roles
      .add(guild.autorole.roleId)
      .then(() =>
        i.reply({
          content: `Role issued ${reactions.smile.random}`,
          ephemeral: true,
        })
      )
      .catch(() =>
        i.reply({
          content: `Failed to issue role !`,
          ephemeral: true,
        })
      );
  }
};

export default autoroleHandler;
