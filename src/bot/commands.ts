import { ICommand } from "../types";
import config from "../config";

export default class Commands {

	private readonly commands: ICommand[];

	constructor(...commands: ICommand[]) {
		this.commands = [...commands];
	}

	/**
	 * finds out if a command with commandName as name exists in this object
	 * @param commandName command name
	 */
	public has = (commandName: string): boolean => {
		return this.commands.some(command => command.name === commandName);
	}

	/**
	 * returns command with commandName as name if existing
	 * @param commandName command name
	 */
	public get = (commandName: string): ICommand | null => {
		let command = this.commands.find(command => command.name === commandName);
		return command ? command : null;
	}

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * @param messageContent message text
	 * @returns command object
	 */
	public find = (messageContent: string): ICommand | undefined =>
		this.commands.find((command: ICommand) =>
			messageContent.match(new RegExp(`^${config.prefix}${command.name}`, "g")) !== null)

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * and checks command's subcommands (and eventually subcommands' subcommands)
	 * @param messageContent message text
	 * @returns command object
	 */
	public altFind = (messageContent: string): ICommand | undefined => {

		if (messageContent.match(new RegExp(`^${config.prefix}`, "g")) !== null) {

			messageContent = messageContent.replace(new RegExp(`^${config.prefix}`, "g"), "");

			let regex = (commandName: string) => new RegExp(`^${commandName}`, "g");

			let fetchSubcommand = (command: ICommand, remainingText: string): ICommand => {
				if (!command.subcommands) return command;
				else {
					remainingText = remainingText.replace(regex(command.name), "").trim();

					let subcommand = command.subcommands.find((subcommand: ICommand) =>
						remainingText.match(new RegExp(`^${subcommand.name}`, "g")) !== null);

					if (!subcommand) {
						return command;
					} else {
						return fetchSubcommand(subcommand, remainingText);
					}
				}
			}

			let mainCommand = this.commands.find((command: ICommand) =>
				messageContent.match(regex(command.name)) !== null);

			if (!mainCommand) return undefined;
			else return fetchSubcommand(mainCommand!, messageContent);

		} else return undefined

	}

	public toArray = (): Array<ICommand> => new Array(...this.commands);

}

interface Category {
	name: string,
	commands: ICommand[]
}

export class CommandsDisplay {

	categories: Array<Category>;

	constructor() {
		this.categories = [];
	}

	addCategory = (categoryName: string | "Miscellaneous" = "Miscellaneous", ...commands: ICommand[]) => {
		this.categories.push({ name: categoryName, commands });
		return this;
	}

}