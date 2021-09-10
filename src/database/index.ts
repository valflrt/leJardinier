import { Guild } from "discord.js";
import { Low, JSONFile } from "lowdb";

let basePath = `${__dirname}database/databases/`;

interface DB {
	guilds: Guild
}

export default new Low<DB>(new JSONFile<DB>(basePath.concat("database.json")));