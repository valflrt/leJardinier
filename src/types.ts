export interface ICommand {
	name: string,
	description: string,
	syntax?: string,
	categoryName?: string,
	execution: Function,
	subcommands?: ICommand[]
}

export interface ICategory {
	name: string,
	commands: ICommand[]
}