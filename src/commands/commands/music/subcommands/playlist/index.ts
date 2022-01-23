import { EmbedFieldData } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";

import CCommand from "../../../../../features/commands/classes/command";

import database from "../../../../../features/database";

// subcommands imports
import clear_cmd from "./subcommands/clear";

const playlist_cmd = new CCommand()
  .setName("playlist")
  .addAlias("pl")
  .setDescription("Display the current playlist")
  .setExecution(async ({ methods, message }) => {
    let guild = await database.guilds.findOne({
      id: message.guildId!,
    });
    if (!guild?.playlist || guild.playlist.length === 0)
      return methods.sendTextEmbed(`The playlist is empty !`);

    let tracksPreview = guild.playlist.map((track, i): EmbedFieldData => {
      return {
        name: bold(`#${i + 1}`),
        value: bold(hyperlink(track.title, track.videoURL)),
      };
    });

    methods.sendCustomEmbed((embed) =>
      embed
        .setDescription(`Here is the current playlist:`)
        .addFields(tracksPreview)
    );
  })
  .addHelpCommand()

  .addSubcommand(() => clear_cmd);

export default playlist_cmd;
