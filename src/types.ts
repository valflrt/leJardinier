export interface ICommand {
	name: string,
	description: string,
	syntax: string,
	category?: string,
	execution: Function,
	subcommands?: ICommand[]
}

export interface ICategory {
	name: string,
	order: number
}