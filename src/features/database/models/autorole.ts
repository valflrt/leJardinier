import { Schema } from "mongoose";

export interface IAutoroleSchema {
  messageId: string;
  channelId: string;
  roleIds: string[];
}

export const autoroleSchema = new Schema<IAutoroleSchema>({
  messageId: { type: String, required: true },
  channelId: { type: String, required: true },
  roleIds: { type: [String], default: [] },
});
