import CCommand from "../../../features/commands/classes/command";

import formatters from "../../../builders/replyFormatters";

import reactions from "../../../assets/reactions";

// subcommands import
import play_cmd from "./subcommands/play";
import add_cmd from "./subcommands/add";
import skip_cmd from "./subcommands/skip";
import stop_cmd from "./subcommands/stop";
import playlist_cmd from "./subcommands/playlist";
import remove_cmd from "./subcommands/remove";

const music_cmd = new CCommand()
  .setName("music")
  .setDescription("Music command")
  .setExecution(async ({ message }) => {
    message.sendCustomEmbed((embed) =>
      embed
        .setDescription(
          `You can play some good tunes with this command ${reactions.smile.random}\n`.concat(
            `Here are the available commands:`
          )
        )
        .setFields(formatters.CommandPreview.createFields(music_cmd.commands))
    );
  })

  .addSubcommand(() => play_cmd)
  .addSubcommand(() => add_cmd)
  .addSubcommand(() => skip_cmd)
  .addSubcommand(() => stop_cmd)
  .addSubcommand(() => playlist_cmd)
  .addSubcommand(() => remove_cmd);

export default music_cmd;
