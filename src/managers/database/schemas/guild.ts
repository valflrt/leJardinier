import { MoreVideoDetails } from "ytdl-core";

import AutoroleSchema from "./autorole";

export default class GuildSchema {
    public id!: string;
    public playlist?: MoreVideoDetails[] = [];
    public autorole?: AutoroleSchema | null = null;
}
