import mongoose from "mongoose";
import { ISong } from "../../types";

export interface IPlaylistSchema {
	guildId: string;
	songs?: ISong[];
}

export const PlaylistSchema = new mongoose.Schema<IPlaylistSchema>({
	guildId: { type: String, required: true },
	songs: {
		type: [
			{
				name: String,
				videoDetails: Object,
			},
		],
		default: [],
	},
});

export const PlaylistModel = mongoose.model<IPlaylistSchema>(
	"Playlist",
	PlaylistSchema
);
