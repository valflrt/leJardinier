import StatsSchema from "./stats";

export default class MemberSchema {
	public userId!: string;
	public guildId!: string;
	public stats?: StatsSchema = new StatsSchema();
}
