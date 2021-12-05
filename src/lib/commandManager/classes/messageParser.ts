import config from "../../../config";

export default class CMessageParser {
	public readonly commandPattern: string[] = [];
	public readonly parameters: string;

	constructor(messageText: string) {
		this.commandPattern = messageText
			.replace(new RegExp(`(^${config.prefix})|( .*$)`, "g"), "")
			.trim()
			.split(/(?!^)\.(?!$)/g);
		this.parameters = messageText
			.replace(
				new RegExp(`^((?:${config.prefix}\\w+)(\\.\\w*)* *)`, "g"),
				""
			)
			.trim();
	}
}
