import { google, youtube_v3 } from "googleapis";

import config from "../../config";

let youtube = google.youtube("v3");

const validYoutubeDomains = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "gaming.youtube.com",
]);
const getVideoId = (url: string): string | null => {
  const parsedUrl = new URL(url);
  let id = parsedUrl.searchParams.get("v");

  if (id) return id;
  else if (
    /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/.test(
      url
    )
  ) {
    const paths = parsedUrl.pathname.split("/");
    return parsedUrl.host === "youtu.be" ? paths[1] : paths[2];
  } else if (parsedUrl.hostname && !validYoutubeDomains.has(parsedUrl.hostname))
    return null;
  if (!id) return null;
  else return id.substring(0, 11);
};

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
    let id = getVideoId(url);
    if (!id) return null;
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
