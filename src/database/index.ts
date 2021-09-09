import { Guild, User } from "discord.js";
import { Low, JSONFile } from "lowdb";

let basePath = `${__dirname}database/databases/`;

interface DB {
	guilds: Guild
}

const DB = new Low<DB>(new JSONFile<DB>(basePath.concat("database.json")));