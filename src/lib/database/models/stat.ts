import mongoose from "mongoose";

export interface IStatSchema {
	level?: number;
	xp?: number;
	messageCount?: number;
	coins?: number;
}

export const StatSchema = new mongoose.Schema<IStatSchema>({
	level: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
	messageCount: { type: Number, default: 0 },
	coins: { type: Number, default: 0 },
});
