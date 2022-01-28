import Command from "../../../../../../features/commands/classes/command";

import database from "../../../../../../features/database";

import reactions from "../../../../../../assets/reactions";

const clear_cmd = new Command({
  name: "clear",
  description: `Clear the current playlist`,
  aliases: ["cl"],
  execution: async ({ actions, message }) => {
    let cleared = await database.guilds.updateOne(
      {
        id: message.guildId!,
      },
      { playlist: [] }
    );
    if (cleared.ok === 1)
      return actions.sendTextEmbed(
        `${reactions.success.random} Playlist cleared`
      );
  },
});

export default clear_cmd;
