import mongoose from "mongoose";

export interface IAccountSchema {
	userId: string
	guildId: string,
	seedCoins: number
}

export const AccountSchema = new mongoose.Schema<IAccountSchema>({
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	seedCoins: { type: Number, default: 0, required: true }
})

export const AccountModel = mongoose.model<IAccountSchema>("Account", AccountSchema);