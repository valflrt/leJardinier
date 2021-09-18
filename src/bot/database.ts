import mongoose from "mongoose";

import config from "../config/database";

import { IGuildSchema, GuildModel } from "../database/models/guild";
import { IUserSchema, UserModel } from "../database/models/user";
import { IStatSchema, StatModel } from "../database/models/stat";

class GuildManager {

	public find = async (id: string) => {
		return await GuildModel.findOne({ id });
	}

	public exists = async (id: string): Promise<boolean> => {
		let doc = await GuildModel.findOne({ id });
		return doc ? true : false;
	}

	public remove = async (id: string) => {
		return await GuildModel.findOneAndRemove({ id });
	}

	public add = async (guild: IGuildSchema) => {
		return await (new GuildModel(guild)).save();
	}

}

class UserManager {

	public find = async (id: string) => {
		return await UserModel.findOne({ id });
	}

	public exists = async (id: string): Promise<boolean> => {
		let doc = await UserModel.findOne({ id });
		return doc ? true : false;
	}

	public remove = async (id: string) => {
		return await UserModel.findOneAndRemove({ id });
	}

	public add = async (user: IUserSchema) => {
		return await (new UserModel(user)).save();
	}

}

class StatManager {

	public find = async (userId: string, guildId: string) => {
		return await StatModel.findOne({ userId, guildId });
	}

	public exists = async (userId: string, guildId: string): Promise<boolean> => {
		let doc = await StatModel.findOne({ userId, guildId });
		return doc ? true : false;
	}

	public remove = async (userId: string, guildId: string) => {
		return await StatModel.findOneAndRemove({ userId, guildId });
	}

	public add = async (stat: IStatSchema) => {
		return await (new StatModel(stat)).save();
	}

}

export const guildManager = new GuildManager();
export const userManager = new UserManager();
export const statManager = new StatManager();

export const connect = () => mongoose.connect(config.databaseURI);

export default {
	connect,
	guildManager,
	userManager,
	statManager
}