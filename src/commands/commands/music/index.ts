import Command from "../../../features/commands/command";

import reactions from "../../../assets/reactions";

// subcommands import
import play_cmd from "./subcommands/play";
import add_cmd from "./subcommands/add";
import skip_cmd from "./subcommands/skip";
import stop_cmd from "./subcommands/stop";
import playlist_cmd from "./subcommands/playlist";
import remove_cmd from "./subcommands/remove";

const music_cmd = new Command({
  name: "music",
  description: "Music command",
  execution: async ({ actions }) => {
    actions.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `You can play some good tunes with this command ${reactions.smile.random}\n`.concat(
            `Here are the available commands:`
          )
        )
        .setFields(music_cmd.preview.embedFields)
    );
  },
  commands: [play_cmd, add_cmd, skip_cmd, stop_cmd, playlist_cmd, remove_cmd],
});

export default music_cmd;
