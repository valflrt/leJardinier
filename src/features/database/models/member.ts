import { Document, model, Schema } from "mongoose";

import { IStatsSchema, statsSchema } from "./stats";

export interface IMemberSchema extends Document {
  userId: string;
  guildId: string;
  stats: IStatsSchema;
}

export const memberSchema = new Schema<IMemberSchema>({
  userId: { type: String, required: true },
  guildId: { type: String, required: [true, "Requires property guildId"] },
  stats: statsSchema,
});

const MemberModel = model("member", memberSchema);

export default MemberModel;
