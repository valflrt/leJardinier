import { ClientUser, Guild } from "discord.js";

export interface SDB {
	guilds: Guild[]
}

export interface SUser extends ClientUser { };

export interface SGuild extends Guild { };