export interface ICommand {
	name: string,
	description: string,
	syntax: string,
	category?: string,
	execution: Function,
	subcommands?: ICommand[]
}