import CCommand from "../../../../../../managers/commands/classes/command";

import PreTrack from "../../../../../../features/musicManager/classes/track";

import reactions from "../../../../../../assets/reactions";

const videoUrl = new CCommand()
  .setName("from video url")
  .setIdentifier("videourl")
  .addAlias("url")
  .setDescription("Add a song to the current playlist from a youtube url")
  .addParameter((p) => p.setName("youtube url").setRequired(true))
  .setExecution(async (messageInstance) => {
    let { methods, message, commandParameters } = messageInstance;

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
        .generateEmbed(messageInstance)
        .setDescription(
          `${reactions.success.random} Added ${track.generateTrackURL()}`
        )
    );
  })
  .addHelpCommand();

export default videoUrl;
