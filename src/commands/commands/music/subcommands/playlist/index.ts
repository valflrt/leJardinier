import { EmbedFieldData } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";

import GuildModel from "../../../../../features/database/models/guild";

import Command from "../../../../../features/commands/command";

// subcommands imports
import clear_cmd from "./subcommands/clear";

const playlist_cmd = new Command({
  name: "playlist",
  description: "Display the current playlist",
  aliases: ["pl"],
  execution:
    () =>
    async ({ actions, message }) => {
      let guild = await GuildModel.findOne({
        id: message.guildId!,
      });
      if (!guild?.playlist || guild.playlist.length === 0)
        return actions.sendTextEmbed(`The playlist is empty !`);

      let tracksPreview = guild.playlist.map((track, i): EmbedFieldData => {
        return {
          name: bold(`#${i + 1}`),
          value: bold(hyperlink(track.title, track.videoURL)),
        };
      });

      actions.sendCustomEmbed((embed) =>
        embed
          .setDescription(`Here is the current playlist:`)
          .addFields(tracksPreview)
      );
    },
  commands: () => [clear_cmd],
});

export default playlist_cmd;
