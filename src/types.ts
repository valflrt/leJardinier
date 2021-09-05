export interface ICommand {
	name: string,
	description: string,
	syntax: string,
	category: ICategory,
	execution: Function,
	subcommands?: ICommand[]
}

export interface ICategory {
	name: string,
	order: number
}