import { ICategory, ICommand } from "../types";
import config from "../config";

export default class CommandList {
	private readonly _commands: ICommand[];
	private readonly _categories: ICategory[] = [];

	constructor(...commands: ICommand[]) {
		this._commands = commands;
	}

	/**
	 * sets a category and all corresponding commands
	 * also adds corresponding category name to each command
	 * @param categoryName {string} category name
	 * @param commands {array} commands to set
	 * @returns {CommandList} "this", used to put together multiple times this method as a "dot chain"
	 */
	public setCategory(
		categoryName: string,
		commands: ICommand[]
	): CommandList {
		commands.forEach((command) => (command.categoryName = categoryName));
		let category: ICategory = { name: categoryName, commands };
		this._categories.push(category);
		return this;
	}

	/**
	 * finds out if a command with commandName as name exists in this object
	 * @param commandName {string} command name
	 * @returns {boolean} whether this.commands has the researched command
	 */
	public has(commandName: string): boolean {
		return this._commands.some((command) => command.name === commandName);
	}

	/**
	 * returns command with commandName as name if existing
	 * @param commandName {string} command name
	 * @returns {ICommand} corresponding command object
	 */
	public get(commandName: string): ICommand | null {
		let command = this._commands.find(
			(command) => command.name === commandName
		);
		return command ? command : null;
	}

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * and checks command's subcommands (and eventually subcommands' subcommands)
	 * @param messageContent {string} message text
	 * @returns {ICommand | undefined} command object or undefined if to found
	 */
	public fetch(messageContent: string): ICommand | undefined {
		if (
			messageContent.match(new RegExp(`^${config.prefix}`, "g")) !== null
		) {
			messageContent = messageContent.replace(
				new RegExp(`^${config.prefix}`, "g"),
				""
			);

			let fetchCommand = (
				commands: ICommand[],
				remainingText: string
			): ICommand | undefined => {
				if (!commands) return;
				else {
					let command = commands.find(
						(command: ICommand) =>
							remainingText.match(
								new RegExp(`^${command.name}(?!\\w+)`, "g")
							) !== null
					);
					if (command && command.commands) {
						remainingText = remainingText
							.replace(
								new RegExp(`^${command.name}(?!\\w+)`, "g"),
								""
							)
							.trim();
						if (
							command.commands.find(
								(command: ICommand) =>
									remainingText.match(
										new RegExp(
											`^${command.name}(?!\\w+)`,
											"g"
										)
									) !== null
							)
						)
							return fetchCommand(
								command.commands,
								remainingText
							);
						else return command;
					} else if (!!command) return command;
					else return undefined;
				}
			};

			return fetchCommand(this._commands, messageContent);
		} else return undefined;
	}

	/**
	 * returns all commands
	 * @returns {ICommand[]} all commands
	 */
	get commands(): ICommand[] {
		return new Array(...this._commands);
	}

	/**
	 * returns all categories
	 * @returns {ICategory[]}
	 */
	get categories(): ICategory[] {
		return new Array(...this._categories);
	}
}
