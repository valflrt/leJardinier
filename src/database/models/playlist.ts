import mongoose from "mongoose";
import { MoreVideoDetails } from "ytdl-core";

export interface IPlaylistSchema {
	guildId: string;
	songs?: MoreVideoDetails[];
}

export const PlaylistSchema = new mongoose.Schema<IPlaylistSchema>({
	guildId: { type: String, required: true },
	songs: {
		type: [Object],
		default: [],
	},
});

export const PlaylistModel = mongoose.model<IPlaylistSchema>(
	"Playlist",
	PlaylistSchema
);
