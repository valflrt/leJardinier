import CCommand from "../../../../../features/commands/classes/command";

import controllersManager from "../../../../../features/music/voice/controllersManager";
import MusicController from "../../../../../features/music/voice/controller";

// subcommands imports
import playlist_cmd from "./subcommands/playlist";
import reactions from "../../../../../assets/reactions";
import PreTrack from "../../../../../features/music/classes/track";
import regexps from "../../../../../assets/regexp";
import youtubeAPI from "../../../../../features/apis/youtube";

const play_cmd = new CCommand()
  .setName("play")
  .addAlias("p")
  .setDescription(
    "Start playing a song from an url (detected automatically) or a research"
  )
  .addParameter((p) => p.setName("url or search").setRequired(true))
  .setExecution(async (context) => {
    let { message, commandParameters } = context;

    if (commandParameters.length === 0)
      return message.sendTextEmbed(
        `${reactions.error.random} You must specify the video url`
      );

    let sent = await message.sendTextEmbed(`Looking for your song...`);

    let track;
    if (regexps.extractYoutubeVideoID.exec(commandParameters)) {
      track = await new PreTrack().fromURL(commandParameters);

      if (!track)
        return message.sendTextEmbed(
          `${reactions.error.random} Couldn't find the song you're looking for ! `.concat(
            `You could try checking your url or giving another one`
          )
        );

      await track.saveToDB(message.guildId!);
    } else {
      let videoSearchData = await youtubeAPI.searchVideo(commandParameters);

      if (!videoSearchData?.id?.videoId)
        return sent.editWithTextEmbed(
          `${reactions.error.random} No results !\n`.concat(
            `Please try another youtube search ${reactions.smile.random}`
          )
        );

      await sent.editWithTextEmbed(`A song was found ! Loading details...`);

      track = await new PreTrack().fromID(videoSearchData.id.videoId);

      if (!track)
        return sent.editWithTextEmbed(
          `${reactions.error.random} Couldn't fetch video information !\n`.concat(
            `This video could be unavailable...`
          )
        );
    }

    await track.saveToDB(message.guildId!);
    await sent.editWithEmbed(
      track
        .generateEmbed(context)
        .setDescription(
          `${reactions.success.random} Added ${track.generateTrackURL()}`
        )
    );

    let controller;
    if (controllersManager.get(message.guildId!)) {
      controller = controllersManager.get(message.guildId!)!;
    } else {
      controller = new MusicController(context);
      controllersManager.register(controller);
    }
    if (controller.currentPlayer?.state === "playing") return;
    await controller.play();
  })
  .addHelpCommand()

  .addSubcommand(() => playlist_cmd);

export default play_cmd;
