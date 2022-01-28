import Command from "../../../../../../features/commands/classes/command";

import PreTrack from "../../../../../../features/music/classes/track";

import reactions from "../../../../../../assets/reactions";

const videoUrl_cmd = new Command({
  name: "from video url",
  identifier: "videourl",
  description: "Add a song to the current playlist from a youtube url",
  aliases: ["url"],
  parameters: [{ name: "youtube url", required: true }],
  execution: async (context) => {
    let { actions, message, attributes } = context;

    if (attributes.parameters.length === 0)
      return actions.sendTextEmbed(
        `${reactions.error.random} You must specify the video url`
      );

    let sent = await actions.sendTextEmbed(`Looking for your song...`);

    let track = await new PreTrack().fromURL(attributes.parameters);

    if (!track)
      return actions.sendTextEmbed(
        `${reactions.error.random} Couldn't find the song you're looking for ! `.concat(
          `You could try checking your url or giving another one`
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

export default videoUrl_cmd;
