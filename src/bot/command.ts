export interface CommandType {
	name: string,
	description: string,
	syntax: string,
	execution: Function
}

export class Command implements CommandType {

	name: string;
	description: string;
	syntax: string;
	execution: Function;

	constructor(command: CommandType) {
		this.name = command.name;
		this.description = command.description;
		this.syntax = command.syntax;
		this.execution = command.execution;
	}

}