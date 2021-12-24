import ytdl, { MoreVideoDetails } from "ytdl-core";

import database from "../../managers/database";
import log from "../../bot/log";

export default class Song {
  private commandArgs: string;

  constructor(commandArgs: string) {
    this.commandArgs = commandArgs;
  }

  get found(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) =>
      (await this.fetchSong()) ? resolve(true) : reject(false)
    );
  }

  get details(): Promise<MoreVideoDetails | undefined> {
    return this.fetchSong();
  }

  public async save(guildId: string) {
    let guild = await database.guilds.findOne({ id: guildId });
    if (!guild)
      return log.system.error(
        "Failed to add song to the playlist: Guild not found !"
      );
    guild!.playlist!.push((await this.fetchSong())!);
    database.guilds.updateOne({ id: guildId }, guild);
  }

  private async fetchSong(): Promise<MoreVideoDetails | undefined> {
    return (await ytdl.getBasicInfo(this.commandArgs!))?.videoDetails;
  }
}
