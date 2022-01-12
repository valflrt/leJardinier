import database from "../../../managers/database";

import { Track } from "../classes/track";

import log from "../../../bot/log";

/**
 * returns the first track in the database
 */
export const getFirstTrack = async (guildId: string): Promise<Track | null> => {
  let guild = await database.guilds.findOne({
    id: guildId!,
  });
  if (!guild || !guild.playlist || !guild.playlist[0]) return null;
  return new Track(guild.playlist[0]);
};

export const removeFirstTrack = async (guildId: string): Promise<void> => {
  let guild = await database.guilds.findOne({
    id: guildId,
  });
  if (!guild) {
    log.system.error("Failed to skip track: Guild not found !");
    return;
  } else if (guild.playlist!.length === 0) {
    log.system.error("Failed to skip track: Playlist is empty !");
    return;
  }
  if (guild.playlist!.length === 0) return;
  guild.playlist!.shift();
  await database.guilds.updateOne(
    {
      id: guildId,
    },
    { playlist: guild.playlist }
  );
};

export default {
  getFirstTrack,
  removeFirstTrack,
};
