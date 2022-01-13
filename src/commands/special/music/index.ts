import CCommand from "../../../managers/commands/classes/command";

import reactions from "../../../assets/reactions";

// subcommands import
import play from "./subcommands/play";
import add from "./subcommands/add";
import skip from "./subcommands/skip";
import stop from "./subcommands/stop";
import playlist from "./subcommands/playlist";
import remove from "./subcommands/remove";

const music = new CCommand()
  .setName("music")
  .setDescription("Music command")
  .setExecution(async (messageInstance) => {
    let { methods } = messageInstance;
    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `You can play some good tunes with this command ${reactions.smile.random}\n`.concat(
            `Here are the available commands:`
          )
        )
        .setFields(
          methods.formatters.CommandPreview.createFields(music.commands)
        )
    );
  })

  .addSubcommand(() => play)
  .addSubcommand(() => add)
  .addSubcommand(() => skip)
  .addSubcommand(() => stop)
  .addSubcommand(() => playlist)
  .addSubcommand(() => remove);

export default music;
