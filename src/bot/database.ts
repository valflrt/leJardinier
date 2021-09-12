import mongoose from "mongoose";

import config from "../config/database";

import { IGuildSchema, GuildModel } from "../database/models/guild";
import { IUserSchema, UserModel } from "../database/models/user";

class GuildManager {

	public findById = async (id: string) => {
		return await GuildModel.findOne({ id });
	}

	public removeById = async (id: string) => {
		return await GuildModel.findOneAndRemove({ id });
	}

	public add = async (guild: IGuildSchema) => {
		return await new GuildModel(guild).save();
	}

}

class UserManager {

	public findById = async (id: string) => {
		return await UserModel.findOne({ id });
	}

	public removeById = async (id: string) => {
		return await UserModel.findOneAndRemove({ id });
	}

	public add = async (user: IUserSchema) => {
		await new UserModel(user).save();
	}

}

export const guildManager = new GuildManager();
export const userManager = new UserManager();

export const connect = () => mongoose.connect(config.databaseURI);

export default {
	connect,
	guildManager,
	userManager
}