import mongoose from "mongoose";
import { IPlaylistSchema, PlaylistSchema } from "./playlist";

export interface IGuildSchema {
	id: string;
	name: string;
	playlist: IPlaylistSchema;
	autoroleMessage: string;
}

export const GuildSchema = new mongoose.Schema<IGuildSchema>({
	id: { type: String, required: true },
	name: { type: String, required: true },
	playlist: { type: PlaylistSchema },
	autoroleMessage: { type: String },
});

export const GuildModel = mongoose.model<IGuildSchema>("Guild", GuildSchema);
