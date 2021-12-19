import DefaultManager from "./default";

import GuildSchema from "../schemas/guild";

export default class GuildManager extends DefaultManager<GuildSchema> {
    protected override schemaConstructor = GuildSchema;
}
