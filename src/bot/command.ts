import config from "../config";

export interface ICommand {
	name: string,
	description: string,
	syntax: string,
	execution: Function,
	subcommands?: ICommand[]
}

export class Command implements ICommand {

	name: string;
	description: string;
	syntax: string;
	execution: Function;
	subcommands?: ICommand[]

	constructor(command: ICommand) {
		this.name = command.name;
		this.description = command.description;
		this.syntax = `${config.prefix}${command.syntax}`;
		this.execution = command.execution;
		this.subcommands = command?.subcommands;
	}

}