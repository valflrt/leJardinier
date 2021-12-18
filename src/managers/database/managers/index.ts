import { Db } from "mongodb";

import GuildManager from "./guild";
import MemberManager from "./member";

export class Managers {
  public guilds!: GuildManager;
  public members!: MemberManager;

  public associate(database: Db) {
    this.guilds = new GuildManager(database, "guilds");
    this.members = new MemberManager(database, "members");
  }
}

const managers = new Managers();

export default managers;
