import CCommand from "./command";

export default class CCommandList {
	private _commands: CCommand[] = [];
	private _categories: Map<string, CCommand[]> = new Map();

	/**
	 * adds a subcommand
	 * @param config function taking a new CCommand as only argument, used to configure
	 * a CCommand
	 * note: you can do the same as explained in CCommand#addParameter
	 * @param categoryName name of the category of the command
	 */
	public addCommand(
		config: (command: CCommand) => CCommand,
		categoryName?: string
	): CCommandList {
		let command = config(new CCommand());
		this._commands.push(command);
		if (categoryName) {
			let category = this.categories.get(categoryName);
			if (!category) this.categories.set(categoryName, []);
			this.categories.get(categoryName)!.push(command);
		}
		return this;
	}

	/**
	 * finds and returns a command in the list using a command pattern generated
	 * by class CMessageContent. if the command isn't found, returns null
	 * @param pattern command call pattern in the form
	 */
	public find(pattern: string[]): CCommand | null {
		const loop = (
			currentLevel: CCommand[] = [],
			i: number
		): CCommand | null => {
			let command = currentLevel.find((c) => c.identifier === pattern[i]);
			if (i === pattern.length - 1 && command) return command!;
			else if (command && command.commands.length !== 0) {
				return loop(command.commands, i + 1);
			} else return null;
		};

		return loop(this.commands, 0);
	}

	/**
	 * finds and returns a command using an identifier
	 * @param identifier string that contains the "path" to the command
	 */
	public get(identifier: string): CCommand | null {
		let command = this.commands.find(
			(c) => c.wholeIdentifier === identifier
		);
		return command ? command : null;
	}

	public get commands(): CCommand[] {
		return this._commands;
	}

	public get categories(): Map<string, CCommand[]> {
		return this._categories;
	}
}
