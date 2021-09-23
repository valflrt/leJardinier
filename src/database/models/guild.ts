import mongoose from "mongoose";

export interface IGuildSchema {
	id: string;
	name: string;
}

export const GuildSchema = new mongoose.Schema<IGuildSchema>({
	id: { type: String, required: true },
	name: { type: String, required: true },
});

export const GuildModel = mongoose.model<IGuildSchema>("Guild", GuildSchema);
