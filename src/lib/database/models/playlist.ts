import mongoose from "mongoose";
import { MoreVideoDetails } from "ytdl-core";

export interface IPlaylistSchema {
	songs?: MoreVideoDetails[];
}

export const PlaylistSchema = new mongoose.Schema<IPlaylistSchema>({
	songs: {
		type: [Object],
		default: [],
	},
});
