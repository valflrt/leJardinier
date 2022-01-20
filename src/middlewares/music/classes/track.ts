import { MessageEmbed } from "discord.js";
import { bold, hyperlink } from "@discordjs/builders";
import { youtube_v3 } from "googleapis";

import database from "../../../managers/database";
import youtubeAPI from "../../../features/apiManagers/youtube";
import log from "../../../bot/log";

import regexps from "../../../assets/regexp";
import MessageInstance from "../../../bot/message";

export interface ITrack {
  title: string;
  videoID: string;
  thumbnailsURL: string;
  videoURL: `https://www.youtube.com/watch?v=${string}`;
}

export default class PreTrack {
  public title?: string;
  public videoID?: string;
  public thumbnailsURL?: string;
  public videoURL?: `https://www.youtube.com/watch?v=${string}`;

  /**
   * Fetches and creates the track object from an url and returns it (if
   * there are missing properties returns null)
   * @param url url where to find video id
   */
  public async fromURL(url: string): Promise<Track | null> {
    let match = regexps.extractYoutubeVideoID.exec(url);
    if (!match) return null;
    let id = match[2];

    let videoDetails = await youtubeAPI.fetchVideoDetails(id);
    if (!videoDetails) return null;

    return this.setDetails(videoDetails) ? new Track(this) : null;
  }

  /**
   * Fetches and creates the track object from an id and returns it (if
   * there are missing properties returns null)
   * @param id video id
   */
  public async fromID(id: string): Promise<Track | null> {
    if (!regexps.validateYoutubeVideoID.test(id)) return null;

    let videoDetails = await youtubeAPI.fetchVideoDetails(id);
    if (!videoDetails) return null;

    return this.setDetails(videoDetails) ? new Track(this) : null;
  }

  /**
   * Sets track properties, if some can't be found returns false else returns
   * true
   * @param videoDetails current playlist details
   */
  private setDetails(videoDetails: youtube_v3.Schema$Video): boolean {
    if (!videoDetails.snippet?.title) return false;
    this.title = videoDetails.snippet.title;

    if (!videoDetails.id) return false;
    this.videoID = videoDetails.id;
    this.videoURL = `https://www.youtube.com/watch?v=${this.videoID!}`;

    if (!videoDetails.snippet.thumbnails?.default?.url) return false;
    this.thumbnailsURL = videoDetails.snippet.thumbnails.default.url;

    return true;
  }
}

export class Track extends PreTrack {
  public title: string;
  public videoID: string;
  public thumbnailsURL: string;
  public videoURL: `https://www.youtube.com/watch?v=${string}`;

  constructor(track: PreTrack | ITrack) {
    super();
    this.title = track.title!;
    this.videoID = track.videoID!;
    this.thumbnailsURL = track.thumbnailsURL!;
    this.videoURL = track.videoURL!;
  }

  /**
   * Saves the current track to playlist in database
   * @param guildId playlist's guild id
   */
  public async saveToDB(guildId: string) {
    let guild = await database.guilds.findOne({ id: guildId });
    if (!guild?.playlist)
      return log.system.error(
        "Failed to add track to the playlist: Guild not found !"
      );
    guild.playlist.push(this as ITrack);
    database.guilds.updateOne({ id: guildId }, guild);
  }

  /**
   * Generates and returns a custom embed for the current track
   * @param messageInstance needed to generate default embed
   */
  public generateEmbed(messageInstance: MessageInstance): MessageEmbed {
    return messageInstance.methods.returnCustomEmbed((embed) =>
      embed.setThumbnail(this.thumbnailsURL)
    );
  }

  /**
   * returns formatted track url for discord
   */
  public generateTrackURL(): string {
    return bold(hyperlink(this.title, this.videoURL));
  }
}
