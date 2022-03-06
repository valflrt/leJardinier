import Command from "../../../../../features/commands/command";

import music_cmd from "../..";

// subcommands imports
import videoUrl_cmd from "./subcommands/videoUrl";
import playlist_cmd from "../play/subcommands/playlist";
import search_cmd from "./subcommands/search";

const add_cmd = new Command({
  name: "add",
  description: "Adds a song to the playlist",
  execution:
    (cmd) =>
    async ({ actions }) => {
      actions.sendCustomEmbed((embed) =>
        embed
          .setDescription(
            `Use this command to add a song to the playlist from youtube:`
          )
          .addFields(cmd.preview.embedFields)
      );
    },
  commands: () => [videoUrl_cmd, playlist_cmd, search_cmd],
});

export default add_cmd;
