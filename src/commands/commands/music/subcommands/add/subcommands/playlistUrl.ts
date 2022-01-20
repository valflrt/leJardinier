import CCommand from "../../../../../../features/commands/classes/command";

import PrePlaylist from "../../../../../../features/music/classes/playlist";

import reactions from "../../../../../../assets/reactions";

const playlistUrl__cmd = new CCommand()
  .setName("playlist url")
  .setIdentifier("playlisturl")
  .addAlias("plurl")
  .setDescription(
    "Adds multiples songs from a youtube playlist url. (20 items maximum in the playlist)"
  )
  .setExecution(async (messageInstance) => {
    let { methods, message, commandParameters } = messageInstance;

    if (commandParameters.length === 0)
      return methods.sendTextEmbed(
        `${reactions.error.random} You need to specify the playlist url !`
      );

    let sent = await methods.sendTextEmbed(`Looking for your playlist...`);

    let playlist = await new PrePlaylist().fromURL(commandParameters);

    if (!playlist)
      return methods.sendTextEmbed(
        `${reactions.error.random} Couldn't find the playlist !\n`.concat(
          `Your url may be invalid.`
        )
      );

    await playlist.saveTracksToDB(message.guildId!);

    sent.editWithCustomEmbed((embed) =>
      embed
        .setDescription(
          `${reactions.success.random} Tracks found ${reactions.smile.random}\n`.concat(
            `Added:\n`.concat(playlist!.generatePreview())
          )
        )
        .addFields()
    );
  });

export default playlistUrl_cmd;
