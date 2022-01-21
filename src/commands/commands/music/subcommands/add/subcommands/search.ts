import CCommand from "../../../../../../features/commands/classes/command";

import PreTrack from "../../../../../../features/music/classes/track";

import youtubeAPI from "../../../../../../features/apis/youtube";

import reactions from "../../../../../../assets/reactions";

const search_cmd = new CCommand()
  .setName("search")
  .setDescription("Add a song to the playlist from youtube search")
  .addParameter((p) => p.setName("youtube search").setRequired(true))
  .setExecution(async (messageInstance) => {
    let { methods, message, commandParameters } = messageInstance;

    if (commandParameters.length === 0)
      return methods.sendTextEmbed(
        `${reactions.error.random} You need to specify text to search for ! `
      );

    let sent = await methods.sendTextEmbed(`Looking for your song...`);

    let videoSearchData = await youtubeAPI.searchVideo(commandParameters);

    if (!videoSearchData?.id?.videoId)
      return sent.editWithTextEmbed(
        `${reactions.error.random} No results !\n`.concat(
          `Please try another youtube search ${reactions.smile.random}`
        )
      );

    await sent.editWithTextEmbed(`Song found ! Loading details...`);

    let track = await new PreTrack().fromID(videoSearchData.id.videoId);

    if (!track)
      return sent.editWithTextEmbed(
        `${reactions.error.random} Couldn't fetch video information !\n`.concat(
          `This video could be unavailable...`
        )
      );

    await track.saveToDB(message.guildId!);
    await sent.editWithEmbed(
      track
        .generateEmbed(messageInstance)
        .setDescription(
          `${reactions.success.random} Added ${track.generateTrackURL()}`
        )
    );
  })
  .addHelpCommand();

export default search_cmd;
