import Command from "../../../../../../features/commands/classes/command";

import PrePlaylist from "../../../../../../features/music/classes/playlist";

import reactions from "../../../../../../assets/reactions";

const playlist_cmd = new Command({
  name: "playlist url",
  identifier: "playlist",
  aliases: ["pl"],
  description:
    "Adds multiples songs from a youtube playlist url. (20 items maximum in the playlist)",
  execution: async ({ actions, message, attributes }) => {
    if (attributes.parameters.length === 0)
      return actions.sendTextEmbed(
        `${reactions.error.random} You need to specify the playlist url !`
      );

    let sent = await actions.sendTextEmbed(`Looking for your playlist...`);

    let playlist = await new PrePlaylist().fromURL(attributes.parameters);

    if (!playlist)
      return actions.sendTextEmbed(
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
  },
});

export default playlist_cmd;
