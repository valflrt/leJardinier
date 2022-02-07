import { Document, Schema } from "mongoose";

export interface IStatsSchema extends Document {
  xp: number;
  totalXp: number;
  level: number;
  messageCount: number;
}

export const statsSchema = new Schema<IStatsSchema>({
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  messageCount: { type: Number, default: 0 },
});
