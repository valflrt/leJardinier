import mongoose from "mongoose";
import { IStatSchema, StatSchema } from "./stat";

export interface IUserSchema {
	id: string;
	stats: IStatSchema;
}

export const UserSchema = new mongoose.Schema<IUserSchema>({
	id: { type: String, required: true },
	stats: { type: StatSchema },
});
