import CCommand from "../../../../../../features/commands/classes/command";

import PreTrack from "../../../../../../features/music/classes/track";

import reactions from "../../../../../../assets/reactions";

const videoUrl_cmd = new CCommand()
  .setName("from video url")
  .setIdentifier("videourl")
  .addAlias("url")
  .setDescription("Add a song to the current playlist from a youtube url")
  .addParameter((p) => p.setName("youtube url").setRequired(true))
  .setExecution(async (context) => {
    let { methods, message, commandParameters } = context;

    if (commandParameters.length === 0)
      return methods.sendTextEmbed(
        `${reactions.error.random} You must specify the video url`
      );

    let sent = await methods.sendTextEmbed(`Looking for your song...`);

    let track = await new PreTrack().fromURL(commandParameters);

    if (!track)
      return methods.sendTextEmbed(
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
  })
  .addHelpCommand();

export default videoUrl_cmd;
