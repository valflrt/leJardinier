import { Document, Schema } from "mongoose";

export interface IAutoroleSchema extends Document {
  messageId: string;
  channelId: string;
  roleIds: string[];
}

export const autoroleSchema = new Schema<IAutoroleSchema>({
  messageId: { type: String, required: true },
  channelId: { type: String, required: true },
  roleIds: { type: [String], default: [] },
});
