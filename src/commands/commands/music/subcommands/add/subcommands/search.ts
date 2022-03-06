import Command from "../../../../../../features/commands/command";

import PreTrack from "../../../../../../features/music/classes/track";

import youtubeAPI from "../../../../../../features/apis/youtube";

import reactions from "../../../../../../assets/reactions";

const search_cmd = new Command({
  name: "search",
  description: "Add a song to the playlist from youtube search",
  parameters: [{ name: "youtube search", required: true }],
  execution: () => async (context) => {
    let { actions, message, attributes } = context;

    if (attributes.parameters.length === 0)
      return actions.sendTextEmbed(
        `${reactions.error.random} You need to specify text to search for ! `
      );

    let sent = await actions.sendTextEmbed(`Looking for your actions, song...`);

    let videoSearchData = await youtubeAPI.searchVideo(attributes.parameters);

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
        .generateEmbed(context)
        .setDescription(
          `${reactions.success.random} Added ${track.generateTrackURL()}`
        )
    );
  },
});

export default search_cmd;
