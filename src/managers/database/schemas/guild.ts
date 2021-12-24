import { VideoDetails } from "../../../middlewares/music/types";

import AutoroleSchema from "./autorole";

export default class GuildSchema {
  public id!: string;
  public playlist?: VideoDetails[] = [];
  public autorole?: AutoroleSchema | null = null;
}
