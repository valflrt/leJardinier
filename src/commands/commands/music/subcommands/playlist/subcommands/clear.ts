import Command from "../../../../../../features/commands/command";

import GuildModel from "../../../../../../features/database/models/guild";

import reactions from "../../../../../../assets/reactions";

const clear_cmd = new Command({
  name: "clear",
  description: `Clear the current playlist`,
  aliases: ["cl"],
  execution:
    () =>
    async ({ actions, message }) => {
      await GuildModel.findOneAndUpdate(
        {
          id: message.guildId!,
        },
        { playlist: [] }
      ).then(() =>
        actions.sendTextEmbed(`${reactions.success.random} Playlist cleared`)
      );
    },
});

export default clear_cmd;
