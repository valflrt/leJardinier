import mongoose from "mongoose";

import config from "../config";

import { IGuildSchema, GuildModel } from "../lib/database/models/guild";
import { IUserSchema, UserModel } from "../lib/database/models/user";
import { IStatSchema, StatModel } from "../lib/database/models/stat";
import { PlaylistModel } from "../lib/database/models/playlist";
import { MoreVideoDetails } from "ytdl-core";

class GuildManager {
	public find = async (id: string) => {
		return await GuildModel.findOne({ id });
	};

	public exists = async (id: string): Promise<boolean> => {
		let doc = await GuildModel.findOne({ id });
		return doc ? true : false;
	};

	public remove = async (id: string) => {
		return await GuildModel.findOneAndRemove({ id });
	};

	public add = async (guild: IGuildSchema) => {
		return await new GuildModel(guild).save();
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
		let playlist = await PlaylistModel.findOne({ guildId });
		if (!playlist)
			playlist = new PlaylistModel({
				guildId,
				song,
			});
		playlist.songs!.push(song);
		return playlist.save();
	};

	public getFirst = async (guildId: string) => {
		let playlist = await PlaylistModel.findOne({ guildId });
		if (!playlist) return undefined;
		if (playlist.songs?.length === 0) return null;
		return playlist.songs![0];
	};

	public removeFirst = async (guildId: string) => {
		let playlist = await PlaylistModel.findOne({ guildId });
		if (!playlist) return;
		playlist.songs!.shift();
		return await playlist.save();
	};

	public clear = async (guildId: string) => {
		let playlist = await PlaylistModel.findOne({ guildId });
		if (!playlist || playlist.songs!.length === 0) return null;
		playlist.songs! = [];
		return await playlist.save();
	};
}

export const guildManager = new GuildManager();
export const userManager = new UserManager();
export const statManager = new StatManager();
export const playlistManager = new PlaylistManager();

export const connect = () => mongoose.connect(config.secrets.databaseURI);

export default {
	connect,

	guilds: guildManager,
	users: userManager,
	playlists: playlistManager,
};
