import mongoose from "mongoose";

import config from "../config/database";

import { IGuildSchema, GuildModel } from "../database/models/guild";
import { IUserSchema, UserModel } from "../database/models/user";
import { IAccountSchema, AccountModel } from "../database/models/account";

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

class AccountManager {

	public find = async (userId: string, guildId: string) => {
		return await AccountModel.findOne({ userId, guildId });
	}

	public exists = async (id: string): Promise<boolean> => {
		let doc = await AccountModel.findOne({ id });
		return doc ? true : false;
	}

	public remove = async (id: string) => {
		return await UserModel.findOneAndRemove({ id });
	}

	public add = async (user: IUserSchema) => {
		return await (new UserModel(user)).save();
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