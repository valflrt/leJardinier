import config from "../config";
import { ICommand } from "../types";

export class Command implements ICommand {
	name: string;
	description: string;
	arguments?: string;
	syntax?: string;
	categoryName?: string;
	requiresDB?: boolean;
	execution: Function;
	commands?: ICommand[];

	constructor(command: ICommand) {
		this.name = command.name;
		this.description = command.description;
		this.arguments = command.arguments ? ` ${command.arguments}` : "";
		this.syntax = `${config.prefix}${this.name}${this.arguments}`;
		this.categoryName = command?.categoryName;
		this.requiresDB = command?.requiresDB;
		this.execution = command.execution;

		// sets subcommand syntax. eg: "[prefix][command name] [subcommand name]"
		command.commands?.forEach(
			(command) =>
				(command.syntax = `${this.syntax} ${command.name}`)
		);

		this.commands = command?.commands;
	}
}
