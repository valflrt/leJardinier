import mongoose from "mongoose";

import config from "../config";

import { IGuildSchema, GuildModel } from "../lib/database/models/guild";
import { IUserSchema, UserModel } from "../lib/database/models/user";
import { IStatSchema, StatModel } from "../lib/database/models/stat";
import { MoreVideoDetails } from "ytdl-core";

class GuildManager {
	public get = async (id: string) => {
		let guild = await GuildModel.findOne({ id });
		return guild ? guild : null;
	};

	public exists = async (id: string): Promise<boolean> => {
		let doc = await GuildModel.findOne({ id });
		return doc ? true : false;
	};

	public remove = async (id: string) => {
		return await GuildModel.findOneAndRemove({ id });
	};

	public add = async (guildObject: IGuildSchema) => {
		let guild = await new GuildModel(guildObject).save();
		return guild ? guild : null;
	};
}

class UserManager {
	public find = async (id: string) => {
		return await UserModel.findOne({ id });
	};

	public exists = async (id: string): Promise<boolean> => {
		let doc = await UserModel.findOne({ id });
		return doc ? true : false;
	};

	public remove = async (id: string) => {
		return await UserModel.findOneAndRemove({ id });
	};

	public add = async (user: IUserSchema) => {
		return await new UserModel(user).save();
	};
}

class StatManager {
	public find = async (userId: string, guildId: string) => {
		return await StatModel.findOne({ userId, guildId });
	};

	public exists = async (
		userId: string,
		guildId: string
	): Promise<boolean> => {
		let doc = await StatModel.findOne({ userId, guildId });
		return doc ? true : false;
	};

	public remove = async (userId: string, guildId: string) => {
		return await StatModel.findOneAndRemove({ userId, guildId });
	};

	public add = async (stat: IStatSchema) => {
		return await new StatModel(stat).save();
	};
}

class PlaylistManager {
	public add = async (guildId: string, song: MoreVideoDetails) => {
		let guild = await database.guilds.get(guildId);
		if (!guild)
			guild = await database.guilds.add({
				id: guildId,
			});
		guild!.playlist!.songs!.push(song);
		return await guild!.save();
	};

	public getFirst = async (guildId: string) => {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist) return undefined;
		if (guild.playlist.songs?.length === 0) return null;
		return guild.playlist.songs![0];
	};

	public removeFirst = async (guildId: string) => {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist) return;
		guild.playlist.songs!.shift();
		return await guild.save();
	};

	public clear = async (guildId: string) => {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist || guild.playlist.songs!.length === 0)
			return null;
		guild.playlist.songs! = [];
		return await guild.save();
	};
}

const connect = () => mongoose.connect(config.secrets.databaseURI);

const database = {
	connect,

	guilds: new GuildManager(),
	users: new UserManager(),
	playlists: new PlaylistManager(),
};

export default database;
