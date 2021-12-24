import { google, youtube_v3 } from "googleapis";

import config from "../../config";

let youtube = google.youtube("v3");

class YoutubeAPI {
  async searchVideo(q: string) {
    let res = await youtube.search.list({
      key: config.secrets.youtubeApiKey,
      part: ["id", "snippet"],
      type: ["video"],
      maxResults: 1,
      q: q,
    });
    if (res.status !== 200) return null;
    let firstItem = res.data.items?.shift();
    if (!firstItem) return null;
    return firstItem;
  }

  async getVideoFromUrl(url: string): Promise<youtube_v3.Schema$Video | null> {
    // TODO: use ytdl url parser
    let res = await youtube.videos.list({
      key: config.secrets.youtubeApiKey,
      part: ["id", "snippet"],
      id: [""],
      maxResults: 1,
    });
    if (res.status !== 200) return null;
    let firstItem = res.data.items?.shift();
    if (!firstItem) return null;
    return firstItem;
  }
}

const youtubeAPI = new YoutubeAPI();

export default youtubeAPI;
