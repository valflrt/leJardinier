import AutoroleSchema from "./autorole";

import { ITrack } from "../../music/classes/track";

export default class GuildSchema {
  public id!: string;
  public playlist?: ITrack[] = [];
  public autorole?: AutoroleSchema[] = [];
}
