import { bold, hyperlink } from "@discordjs/builders";

import youtubeAPI from "../../managers/api/youtube";
import { VideoDetails } from "./types";

import { SentMessage } from "../../declarations/types";

import database from "../../managers/database";
import log from "../../bot/log";

import reactions from "../../assets/reactions";

export default class Song {
  public found: boolean = false;
  public videoDetails: VideoDetails | null = null;

  public async save(guildId: string) {
    let guild = await database.guilds.findOne({ id: guildId });
    if (!guild)
      return log.system.error(
        "Failed to add song to the playlist: Guild not found !"
      );
    guild!.playlist!.push(this.videoDetails!);
    database.guilds.updateOne({ id: guildId }, guild);
  }

  public async editEmbed(sent: SentMessage) {
    sent.editWithCustomEmbed((embed) =>
      embed
        .setThumbnail(
          this.videoDetails!.snippet?.thumbnails?.default?.url ?? ""
        )
        .setDescription(
          `${reactions.success.random} Added ${bold(
            hyperlink(
              this.videoDetails!.snippet?.title ?? "Unknown",
              this.videoDetails!.id
                ? `https://youtu.be/${this.videoDetails!.id}`
                : ""
            )
          )}`
        )
    );
  }

  public async fetchWithURL(url: string): Promise<VideoDetails | null> {
    let details = await youtubeAPI.getVideoInfoFromURL(url);
    this.found = !!details;
    this.videoDetails = details ?? null;
    return details ?? null;
  }

  public async fetchWithId(id: string): Promise<VideoDetails | null> {
    let details = await youtubeAPI.getVideoInfoFromVideoId(id);
    this.found = !!details;
    this.videoDetails = details ?? null;
    return details ?? null;
  }
}
