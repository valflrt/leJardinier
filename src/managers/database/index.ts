import { Db } from "mongodb";

import GuildManager from "./managers/guild";
import MemberManager from "./managers/member";

export class DatabaseManagers {
	public guilds!: GuildManager;
	public members!: MemberManager;

	public associate(database: Db) {
		this.guilds = new GuildManager(database, "guilds");
		this.members = new MemberManager(database, "members");
	}
}

const database = new DatabaseManagers();

export default database;
