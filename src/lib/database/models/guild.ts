import mongoose from "mongoose";
import { IPlaylistSchema, PlaylistSchema } from "./playlist";
import { IUserSchema, UserSchema } from "./user";

export interface IGuildSchema {
	id: string;
	playlist?: IPlaylistSchema;
	users?: IUserSchema[];
	autoroleMessage?: string;
}

export const GuildSchema = new mongoose.Schema<IGuildSchema>({
	id: { type: String, required: true },
	playlist: { type: PlaylistSchema },
	users: { type: [UserSchema], default: [] },
	autoroleMessage: { type: String },
});

export const GuildModel = mongoose.model<IGuildSchema>("Guild", GuildSchema);
