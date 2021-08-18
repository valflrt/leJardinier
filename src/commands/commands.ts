import { Command } from "../types";
import config from "../config";

class Commands {

	private commands: Command[];

	constructor() {
		this.commands = new Array();
	}

	/**
	 * adds a command
	 * @param command command object
	 */
	public add = (command: Command) => this.commands.push(command);

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
	public get = (commandName: string): Command | null => {
		let command = this.commands.find(command => command.name === commandName);
		return command ? command : null;
	}

	/**
	 * returns the command array
	 * @returns command array
	 */
	public find = (messageContent: string): Command => this.commands.filter((command: Command) => messageContent.match(new RegExp(`^${config.prefix}${command.name}`, "g")) !== null)[0];

};

export default new Commands();