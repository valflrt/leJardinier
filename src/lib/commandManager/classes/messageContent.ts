import config from "../../../config";

export default class CMessageContent {
	public readonly commandPattern: string[] = [];
	public readonly parameters: string[] = [];

	constructor(messageText: string) {
		if (messageText.startsWith(config.prefix)) {
			this.commandPattern = messageText
				.replace(new RegExp(`(^${config.prefix})|( .{0,}$)`, "g"), "")
				.trim()
				.split(/(?!^)\.(?!$)/g);
			this.parameters = messageText
				.replace(
					new RegExp(
						`^((?:${config.prefix}\\w+)(\\.\\w{0,}){0,} {0,})`,
						"g"
					),
					""
				)
				.trim()
				.split(/\s+/g);
		}
	}
}
