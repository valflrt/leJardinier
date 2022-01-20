import CCommand from "../../../../../features/commands/classes/command";

import music_cmd from "../..";

// subcommands imports
import videoUrl_cmd from "./subcommands/videoUrl";
import playlistUrl_cmd from "./subcommands/playlistUrl";
import search_cmd from "./subcommands/search";

const add_cmd = new CCommand()
  .setName("add")
  .setDescription("Adds a song to the playlist")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `Use this command to add a song to the playlist from youtube:`
        )
        .addFields(
          methods.formatters.CommandPreview.createFields(
            music_cmd.commands.find((c) => c.identifier === "add")!.commands
          )
        )
    );
  })
  .addHelpCommand()

  .addSubcommand(() => videoUrl_cmd)
  .addSubcommand(() => playlistUrl_cmd)
  .addSubcommand(() => search_cmd);

export default add_cmd;
