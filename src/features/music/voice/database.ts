import { Track } from "../classes/track";

import log from "../../../bot/log";
import GuildModel from "../../database/models/guild";

/**
 * Returns the first track in the database
 */
export const getFirstTrack = async (guildId: string): Promise<Track | null> => {
  let guild = await GuildModel.findOne({
    id: guildId!,
  });
  if (!guild || !guild.playlist || !guild.playlist[0]) return null;
  return new Track(guild.playlist[0]);
};

export const removeFirstTrack = async (guildId: string): Promise<void> => {
  let guild = await GuildModel.findOne({
    id: guildId,
  });
  if (!guild) {
    log.error("Failed to skip track: Guild not found !");
    return;
  } else if (guild.playlist!.length === 0) {
    log.error("Failed to skip track: Playlist is empty !");
    return;
  }
  if (guild.playlist!.length === 0) return;
  guild.playlist!.shift();
  await guild.save();
};

export default {
  getFirstTrack,
  removeFirstTrack,
};
