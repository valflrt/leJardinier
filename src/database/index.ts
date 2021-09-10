import { Guild } from "discord.js";
import { Low, JSONFile } from "lowdb";

let basePath = `${__dirname}database/databases/`;

export interface DBSchema {
	guilds: Guild
}

export default new Low<DBSchema>(new JSONFile<DBSchema>(basePath.concat("database.json")));