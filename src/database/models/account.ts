import mongoose from "mongoose";

import { IUserSchema, UserSchema } from "./user";
import { IGuildSchema, GuildSchema } from "./guild";

export interface IAccountSchema {
	user: IUserSchema
	guild: IGuildSchema
	seedCoins?: number
}

export const AccountSchema = new mongoose.Schema<IAccountSchema>({
	user: UserSchema,
	guild: GuildSchema,
	seedCoins: { type: Number, default: 0 }
})

export const AccountModel = mongoose.model<IAccountSchema>("Account", AccountSchema);