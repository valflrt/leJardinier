import { MongoClient, Db } from "mongodb";

import GuildManager from "./managers/guild";
import MemberManager from "./managers/member";

import config from "../../config";

export const connectDatabase = async (): Promise<void> => {
  const client = new MongoClient(config.secrets.databaseURI);
  await client.connect();
  database.associate(client.db(config.secrets.databaseName));
};

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
