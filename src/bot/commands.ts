import { CommandType } from "./command";
import config from "../config";

export default class CommandTypes {

	private readonly commands: CommandType[];

	constructor(...commands: CommandType[]) {
		this.commands = [...commands];
	}

	/**
	 * adds one or more commands
	 * @param command command object
	 */
	public add = (...commands: CommandType[]) => this.commands.push(...commands);

	/**
	 * finds out if a command with commandName as name exists in this object
	 * @param commandName command name
	 */
	public has = (commandName: string): boolean => {
		let command = this.commands.find(command => command.name === commandName);
		return command ? true : false;
	}

	/**
	 * returns command with commandName as name if existing
	 * @param commandName command name
	 */
	public get = (commandName: string): CommandType | null => {
		let command = this.commands.find(command => command.name === commandName);
		return command ? command : null;
	}

	/**
	 * finds a command call directly in message content (message text sent on discord)
	 * @param messageContent message text
	 * @returns command object
	 */
	public find = (messageContent: string): CommandType | undefined => this.commands.find(
		(command: CommandType) => messageContent.match(new RegExp(`^${config.prefix}${command.name}`, "g")) !== null
	)

	public toArray = (): Array<CommandType> => new Array(...this.commands);

}