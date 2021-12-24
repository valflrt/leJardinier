import axios from "axios";

import config from "../../config";

export const fetchPlaylistItems = async (playlistId: string) => {
  let response = await axios.get(
    [
      `https://youtube.googleapis.com/youtube/v3/playlistItems?`,
      `part=contentDetails`,
      `playlistId=${playlistId}`,
      `alt=json`,
      `key=${config.secrets.youtubeApiKey}`,
    ].join("&")
  );
  if (!response.data) return undefined;
  return response.data.items as any[];
};

export const fetchPlaylist = async (url: string) => {
  let playlistId = url
    .split(/&/g)
    .find((s) => s.startsWith("list="))
    ?.replace(/^list=/g, "");
  if (!playlistId) return null;
  let response = await axios.get(
    [
      `https://youtube.googleapis.com/youtube/v3/playlists?`,
      `part=snippet`,
      `id=${playlistId}`,
      `alt=json`,
      `key=${config.secrets.youtubeApiKey}`,
    ].join("&")
  );
  if (!response) return undefined;
  return response.data.items[0];
};
