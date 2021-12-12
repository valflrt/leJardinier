import mongoose from "mongoose";

export interface IStatSchema {
	userId: string;
	guildId: string;
	messageCount?: number;
	coins?: number;
}

export const StatSchema = new mongoose.Schema<IStatSchema>({
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	messageCount: { type: Number, default: 1 },
	coins: { type: Number, default: 0 },
});
