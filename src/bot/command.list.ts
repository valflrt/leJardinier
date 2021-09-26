import { ICategory, ICommand } from "../types";
import config from "../config";

export default class CommandList {
	private readonly commands: ICommand[];
	private readonly categories: ICategory[] = [];

	constructor(...commands: ICommand[]) {
		let filter = (a: ICommand, b: ICommand) => b.name.length - a.name.length;
		let sortSubcommands = (subcommands: ICommand[] | undefined) => {
			if (!subcommands) return;
			subcommands.forEach((subcommand: ICommand) => {
				subcommand.subcommands?.sort(filter);
				sortSubcommands(subcommand.subcommands);
			});
		};
		sortSubcommands(commands)

		this.commands = commands.sort(filter);
	}

	/**
	 * sets a category and all corresponding commands
	 * also adds corresponding category name to each command
	 * @param categoryName {string} category name
	 * @param commands {array} commands to set
	 * @returns {CommandList} "this", used to put together multiple times this method as a "dot chain"
	 */
	public setCategory = (
		categoryName: string,
		commands: ICommand[]
	): CommandList => {
		commands.forEach((command) => (command.categoryName = categoryName));
		let category: ICategory = { name: categoryName, commands };
		this.categories.push(category);
		return this;
	};

	/**
	 * finds out if a command with commandName as name exists in this object
	 * @param commandName {string} command name
	 * @returns {boolean} wether this.commands has the researched command
	 */
	public has = (commandName: string): boolean => {
		return this.commands.some((command) => command.name === commandName);
	};

	/**
	 * returns command with commandName as name if existing
	 * @param commandName {string} command name
	 * @returns {ICommand} corresponding command object
	 */
	public get = (commandName: string): ICommand | null => {
		let command = this.commands.find(
			(command) => command.name === commandName
		);
		return command ? command : null;
	};

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * @param messageContent {string} message text
	 * @returns {ICommand} corresponding command object
	 */
	public find = (messageContent: string): ICommand | undefined =>
		this.commands.find(
			(command: ICommand) =>
				messageContent.match(
					new RegExp(`^${config.prefix}${command.name}`, "g")
				) !== null
		);

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * and checks command's subcommands (and eventually subcommands' subcommands)
	 * @param messageContent {string} message text
	 * @returns {ICommand | undefined} command object or undefined if to found
	 */
	public altFind = (messageContent: string): ICommand | undefined => {
		if (
			messageContent.match(new RegExp(`^${config.prefix}`, "g")) !== null
		) {
			messageContent = messageContent.replace(
				new RegExp(`^${config.prefix}`, "g"),
				""
			);

			let regex = (commandName: string) =>
				new RegExp(`^${commandName}`, "g");

			let fetchSubcommand = (
				command: ICommand,
				remainingText: string
			): ICommand => {
				if (!command.subcommands) return command;
				else {
					remainingText = remainingText
						.replace(regex(command.name), "")
						.trim();

					let subcommand = command.subcommands.find(
						(subcommand: ICommand) =>
							remainingText.match(
								new RegExp(`^${subcommand.name}`, "g")
							) !== null
					);

					if (!subcommand) {
						return command;
					} else {
						return fetchSubcommand(subcommand, remainingText);
					}
				}
			};

			let mainCommand = this.commands.find(
				(command: ICommand) =>
					messageContent.match(regex(command.name)) !== null
			);

			if (!mainCommand) return undefined;
			else return fetchSubcommand(mainCommand!, messageContent);
		} else return undefined;
	};

	/**
	 * returns all commands
	 * @returns {ICommand[]} all commands
	 */
	public getCommands = (): ICommand[] => new Array(...this.commands);

	/**
	 * returns all categories
	 * @returns {ICategory[]}
	 */
	public getCategories = (): ICategory[] => new Array(...this.categories);
}
