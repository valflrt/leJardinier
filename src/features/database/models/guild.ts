import { Document, model, Schema } from "mongoose";

import { ITrack } from "../../music/classes/track";
import { IAutoroleSchema } from "./autorole";

export interface IGuildSchema extends Document {
  id: string;
  playlist: ITrack[];
  autorole: IAutoroleSchema[];
}

export const guildSchema = new Schema<IGuildSchema>({
  id: { type: String, required: true },
  playlist: { type: [], default: [] },
  autorole: { type: [], default: [] },
});

const GuildModel = model("guild", guildSchema);

export default GuildModel;
