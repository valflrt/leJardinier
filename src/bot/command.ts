import config from "../config";
import { ICategory, ICommand } from "../types";

export class Command implements ICommand {

	name: string;
	description: string;
	syntax: string;
	categoryName?: string;
	execution: Function;
	subcommands?: ICommand[];

	constructor(command: ICommand) {
		this.name = command.name;
		this.description = command.description;
		this.syntax = `${config.prefix}${command.syntax}`;
		this.categoryName = command?.categoryName;
		this.execution = command.execution;
		this.subcommands = command?.subcommands;
	}

}