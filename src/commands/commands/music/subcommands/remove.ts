import { bold } from "@discordjs/builders";

import Command from "../../../../features/commands/command";
import { Track } from "../../../../features/music/classes/track";

import GuildModel from "../../../../features/database/models/guild";

import reactions from "../../../../assets/reactions";

const remove_cmd = new Command({
  name: "remove",
  description: "Removes a track the current playlist",
  aliases: ["rm"],
  parameters: [{ name: "track id", required: true }],
  execution:
    () =>
    async ({ actions, message, attributes }) => {
      if (!attributes.parameters)
        return actions.sendTextEmbed(
          `${reactions.error.random} You need to specify an id !`
        );

      let videoID = +(+attributes.parameters); // used to make sure the number is positive

      if (!videoID || !Number.isInteger(videoID))
        return actions.sendTextEmbed(
          `${reactions.error.random} Incorrect id !\n`.concat(
            `Please use an integer as id (eg: 1, 2, 56, 5797837, ...)`
          )
        );

      let guild = await GuildModel.findOne({
        id: message.guildId!,
      });
      if (!guild)
        return actions.sendTextEmbed(
          `${reactions.success.random} Current playlist is empty`
        );

      let removed = new Track(guild.playlist!.splice(videoID - 1, 1)[0]);

      await guild.save();

      actions.sendTextEmbed(
        `${reactions.success.random} Removed `.concat(
          `${bold(`#${videoID}`)}: ${removed.generateTrackURL()}`
        )
      );
    },
});

export default remove_cmd;
