export default class CMessageContent {
	public readonly commandPattern: string[] = [];
	public readonly parameters: string[] = [];

	constructor(messageText: string) {
		let prefix = "lj!";
		if (messageText.startsWith(prefix)) {
			this.commandPattern = messageText
				.replace(new RegExp(`(^${prefix})|( .{0,}$)`, "g"), "")
				.trim()
				.split(/(?!^)\.(?!$)/g);
			this.parameters = messageText
				.replace(new RegExp(`^(${prefix}\\w+(\\.\\w+){0,} )`, "g"), "")
				.trim()
				.split(/\s+/g);
		}
	}
}
