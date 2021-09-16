import mongoose from "mongoose";

import { IUserSchema } from "./user";
import { IGuildSchema } from "./guild";

export interface IAccountSchema {
	user: IUserSchema
	guild: IGuildSchema
	seedCoins?: number
}

export const AccountSchema = new mongoose.Schema<IAccountSchema>({
	user: { required: true },
	guild: { required: true },
	seedCoins: { type: Number, default: 0 }
})

export const AccountModel = mongoose.model<IAccountSchema>("Account", AccountSchema);