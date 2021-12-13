import mongoose from "mongoose";

import config from "../config";

import { IGuildSchema, GuildModel } from "../lib/database/models/guild";
import { IUserSchema, UserSchema } from "../lib/database/models/user";
import { IStatSchema } from "../lib/database/models/stat";
import { MoreVideoDetails } from "ytdl-core";
import log from "../bot/log";

class CGuildManager {
	public async get(id: string) {
		let guild = await GuildModel.findOne({ id });
		return guild ? guild : null;
	}

	public async exists(id: string): Promise<boolean> {
		let doc = await GuildModel.findOne({ id });
		return doc ? true : false;
	}

	public async remove(id: string) {
		return await GuildModel.findOneAndRemove({ id });
	}

	public async add(guildObject: IGuildSchema) {
		let guild = await new GuildModel(guildObject).save();
		return guild ? guild : null;
	}
}

class CUserManager {
	public async get(guildId: string, userId: string) {
		let guild = await database.guilds.get(guildId);
		if (!guild) return null;
		let user = guild.users!.find((u) => u.id === userId);
		if (!user) return null;
		return user;
	}

	public async exists(guildId: string, userId: string): Promise<boolean> {
		return (await database.users.get(guildId, userId)) ? true : false;
	}

	public async remove(guildId: string, userId: string) {
		let guild = await database.guilds.get(guildId);
		if (!guild)
			return log.baseLogger.error("Couldn't find (and remove) user");
		let user = guild.users!.find((u) => u.id === userId);
		if (!user)
			return log.baseLogger.error("Couldn't find (and remove) user");
		guild.users! = guild.users!.filter((u) => !(u.id === userId));
		return await guild.save();
	}

	public async add(guildId: string, userSchema: IUserSchema) {
		let guild = await database.guilds.get(guildId);
		if (!guild) return log.baseLogger.error("Couldn't create user");
		guild.users!.push(userSchema);
		return await guild.save();
	}

	public async update(
		guildId: string,
		userId: string,
		userSchema: IUserSchema
	) {
		let guild = await database.guilds.get(guildId);
		if (!guild) return null;
		let user = guild.users!.find((u) => u.id === userId);
		if (!user) return null;
		user = userSchema;
		return guild.save();
	}

	public async updateStats(
		guildId: string,
		userId: string,
		statsConfig: (currentStats: IStatSchema) => IStatSchema
	) {
		let guild = await database.guilds.get(guildId);
		if (!guild) return null;
		let user = guild.users!.find((u) => u.id === userId);
		if (!user) return null;
		user.stats = statsConfig(user.stats);
		return guild.save();
	}
}

class CPlaylistManager {
	public async add(guildId: string, song: MoreVideoDetails) {
		let guild = await database.guilds.get(guildId);
		if (!guild)
			guild = await database.guilds.add({
				id: guildId,
			});
		guild!.playlist!.songs!.push(song);
		return await guild!.save();
	}

	public async getFirst(guildId: string) {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist) return undefined;
		if (guild.playlist.songs?.length === 0) return null;
		return guild.playlist.songs![0];
	}

	public async removeFirst(guildId: string) {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist) return;
		guild.playlist.songs!.shift();
		return await guild.save();
	}

	public async clear(guildId: string) {
		let guild = await database.guilds.get(guildId);
		if (!guild || !guild.playlist || guild.playlist.songs!.length === 0)
			return null;
		guild.playlist.songs! = [];
		return await guild.save();
	}
}

const connect = () => mongoose.connect(config.secrets.databaseURI);

const database = {
	connect,

	guilds: new CGuildManager(),
	users: new CUserManager(),
	playlists: new CPlaylistManager(),
};

export default database;
