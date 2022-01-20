import { google, youtube_v3 } from "googleapis";

import config from "../../config/index.secret";

let youtube = google.youtube("v3");

class YoutubeAPI {
  public async searchVideo(
    q: string
  ): Promise<youtube_v3.Schema$SearchResult | null> {
    let res = await youtube.search.list({
      key: config.secrets.youtubeApiKey,
      part: ["id", "snippet"],
      type: ["video"],
      maxResults: 1,
      q: q,
    });
    if (res.status !== 200) return null;
    let firstItem = res.data.items?.shift();
    if (!firstItem?.snippet) return null;
    return firstItem;
  }

  public async fetchPlaylistDetails(
    id: string
  ): Promise<youtube_v3.Schema$Playlist | null> {
    let res = await youtube.playlists.list({
      key: config.secrets.youtubeApiKey,
      part: ["snippet"],
      id: [id],
    });
    if (res.status !== 200) return null;
    let firstItem = res.data.items?.shift();
    if (!firstItem?.snippet) return null;
    return firstItem;
  }

  public async fetchPlaylistItems(
    playlistId: string
  ): Promise<youtube_v3.Schema$PlaylistItem[] | null> {
    let res = await youtube.playlistItems.list({
      key: config.secrets.youtubeApiKey,
      part: ["contentDetails"],
      playlistId,
    });
    if (res.status !== 200) return null;
    let items = res.data.items;
    if (!items) return null;
    return items;
  }

  public async fetchVideoDetails(
    videoID: string
  ): Promise<youtube_v3.Schema$Video | null> {
    let res = await youtube.videos.list({
      key: config.secrets.youtubeApiKey,
      part: ["id", "snippet"],
      id: [videoID],
      maxResults: 1,
    });
    if (res.status !== 200) return null;
    let firstItem = res.data.items?.shift();
    if (!firstItem?.snippet) return null;
    return firstItem;
  }
}

const youtubeAPI = new YoutubeAPI();

export default youtubeAPI;
