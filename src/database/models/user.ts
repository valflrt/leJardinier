import mongoose from "mongoose";

export interface IUserSchema {
	id: string
	username: string
}

export const UserSchema = new mongoose.Schema<IUserSchema>({
	id: { type: String, required: true },
	username: { type: String, required: true }
})

export const UserModel = mongoose.model<IUserSchema>("User", UserSchema);