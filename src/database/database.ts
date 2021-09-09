import { Guild, User } from "discord.js";
import { Low, JSONFile } from "lowdb";

interface DB {
	guilds: Guild[],
	users: User[]
}

const DB = new Low<DB>(new JSONFile<DB>(`${__dirname}database/database.json`));