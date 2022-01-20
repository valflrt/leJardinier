import { ITrack } from "../../../features/musicManager/classes/track";

import AutoroleSchema from "./autorole";

export default class GuildSchema {
  public id!: string;
  public playlist?: ITrack[] = [];
  public autorole?: AutoroleSchema | null = null;
}
