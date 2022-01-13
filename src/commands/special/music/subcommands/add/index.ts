import CCommand from "../../../../../managers/commands/classes/command";

import music from "../..";

// subcommands imports
import videoUrl from "./subcommands/videourl";
import playlistUrl from "./subcommands/playlistUrl";
import search from "./subcommands/search";

const add = new CCommand()
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
            music.commands.find((c) => c.identifier === "add")!.commands
          )
        )
    );
  })
  .addHelpCommand()

  .addSubcommand(() => videoUrl)
  .addSubcommand(() => playlistUrl)
  .addSubcommand(() => search);

export default add;
