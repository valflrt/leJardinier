import { model, Schema } from "mongoose";

interface IGuild {
	id: string,
	name: string
}

let GuildSchema = new Schema<IGuild>({
	id: { type: String, required: true },
	name: { type: String, required: true }
})

export default model<IGuild>("Guild", GuildSchema);