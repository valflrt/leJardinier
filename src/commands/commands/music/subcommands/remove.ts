import { bold } from "@discordjs/builders";

import CCommand from "../../../../features/commands/classes/command";
import { Track } from "../../../../features/music/classes/track";

import database from "../../../../features/database";

import reactions from "../../../../assets/reactions";

const remove_cmd = new CCommand()
  .setName("remove")
  .addAlias("rm")
  .setDescription("Removes a track the current playlist")
  .addParameter((p) => p.setName("track id").setRequired(true))
  .setExecution(async ({ methods, message, commandParameters }) => {
    if (!commandParameters)
      return methods.sendTextEmbed(
        `${reactions.error.random} You need to specify an id !`
      );

    let videoID = +(+commandParameters); // used to make sure the number is positive

    if (!videoID || !Number.isInteger(videoID))
      return methods.sendTextEmbed(
        `${reactions.error.random} Incorrect id !\n`.concat(
          `Please use an integer as id (eg: 1, 2, 56, 5797837, ...)`
        )
      );

    let guild = await database.guilds.findOne({
      id: message.guildId!,
    });
    if (!guild)
      return methods.sendTextEmbed(
        `${reactions.success.random} Current playlist is empty`
      );

    let removed = new Track(guild.playlist!.splice(videoID - 1, 1)[0]);

    await database.guilds.updateOne(
      {
        id: message.guildId!,
      },
      { playlist: guild.playlist }
    );

    methods.sendTextEmbed(
      `${reactions.success.random} Removed `.concat(
        `${bold(`#${videoID}`)}: ${removed.generateTrackURL()}`
      )
    );
  })
  .addHelpCommand();

export default remove_cmd;
