import { bold, hyperlink } from "@discordjs/builders";
import { youtube_v3 } from "googleapis";

import youtubeAPI from "../../../managers/api/youtube";
import PreTrack, { Track } from "./track";

import regexps from "../../../assets/regexp";

export interface IPlaylist {
  title: string;
  playlistID: string;
  playlistURL: `https://www.youtube.com/playlist?list=${string}`;
  tracks: Track[];
}

export default class PrePlaylist implements Partial<IPlaylist> {
  public title?: string;
  public playlistID?: string;
  public playlistURL?: `https://www.youtube.com/playlist?list=${string}`;
  public tracks: Track[] = [];

  /**
   * Fetches and creates the Playlist object from an url and returns it (if there are missing properties
   * returns null)
   * @param url url where to find playlist id
   */
  public async fromURL(url: string): Promise<Playlist | null> {
    let match = regexps.extractYoutubePlaylistID.exec(url);
    if (!match) return null;
    let id = match[1];

    let playlistDetails = await youtubeAPI.fetchPlaylistDetails(id);
    if (playlistDetails === null) return null;

    return (await this.setDetails(playlistDetails)) ? new Playlist(this) : null;
  }

  /**
   * Fetches and creates the track object from an id and returns it (if
   * there are missing properties returns null)
   * @param id video id
   */
  public async fromID(id: string): Promise<Playlist | null> {
    let playlistDetails = await youtubeAPI.fetchPlaylistDetails(id);
    if (!playlistDetails) return null;

    return (await this.setDetails(playlistDetails)) ? new Playlist(this) : null;
  }

  /**
   * Sets playlist properties, if some can't be found returns false else returns
   * true
   * @param playlistDetails current playlist details
   */
  private async setDetails(
    playlistDetails: youtube_v3.Schema$Playlist
  ): Promise<boolean> {
    // sets playlist id and url
    if (!playlistDetails.id) return false;
    this.playlistID = playlistDetails.id;
    this.playlistURL = `https://www.youtube.com/playlist?list=${playlistDetails.id}`;

    // sets playlist title
    if (!playlistDetails.snippet?.title) return false;
    this.title = playlistDetails.snippet.title;

    // fetches playlist items, if not found rejects playlist creation
    let playlistItems = await youtubeAPI.fetchPlaylistItems(this.playlistID);
    if (!playlistItems) return false;

    // Creates a PreTrack promise array to be evaluated
    let preTracks = playlistItems?.map((item) =>
      new PreTrack().fromID(item.id ?? "")
    );

    // When all tracks loaded create a new array of Track or null
    let tracks = await Promise.all(preTracks);
    // If there is one item that is null reject playlist creation
    if (tracks.some((s) => !s)) return false;

    // if every property was found returns true
    return true;
  }
}

export class Playlist extends PrePlaylist implements IPlaylist {
  public title: string;
  public playlistID: string;
  public playlistURL: `https://www.youtube.com/playlist?list=${string}`;
  public tracks: Track[];

  constructor(playlist: PrePlaylist) {
    super();
    this.title = playlist.title!;
    this.playlistID = playlist.playlistID!;
    this.playlistURL = playlist.playlistURL!;
    this.tracks = playlist.tracks;
  }

  /**
   * Generates and returns the formatted playlist preview for discord
   */
  public generatePreview(): string {
    return this.tracks
      .map((track) => track.generateTrackURL())
      .join("\n")
      .concat(`\n${this.generatePlaylistURL()}`);
  }

  /**
   * returns formatted playlist url for discord
   */
  public generatePlaylistURL(): string {
    return bold(hyperlink(this.title, this.playlistURL));
  }
}
