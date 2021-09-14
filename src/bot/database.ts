import mongoose from "mongoose";

import config from "../config/database";

import { IGuildSchema, GuildModel } from "../database/models/guild";
import { IUserSchema, UserModel } from "../database/models/user";

class GuildManager {

	public find = async (id: string) => {
		return await GuildModel.findOne({ id });
	}

	public exists = async (id: string): Promise<boolean> => {
		let guildDoc = await GuildModel.findOne({ id });
		return guildDoc ? true : false;
	}

	public remove = async (id: string) => {
		return await GuildModel.findOneAndRemove({ id });
	}

	public add = async (guild: IGuildSchema) => {
		let doc = new GuildModel(guild);
		return await doc.save();
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