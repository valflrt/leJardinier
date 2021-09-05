import config from "../config";
import { ICategory, ICommand } from "../types";

export class Command implements ICommand {

	name: string;
	description: string;
	syntax: string;
	category: ICategory;
	execution: Function;
	subcommands?: ICommand[];

	constructor(command: ICommand) {
		this.name = command.name;
		this.description = command.description;
		this.syntax = `${config.prefix}${command.syntax}`;
		this.category = command.category;
		this.execution = command.execution;
		this.subcommands = command?.subcommands;
	}

}