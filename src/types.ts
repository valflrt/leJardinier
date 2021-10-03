export interface ICommand {
	name: string;
	description: string;
	arguments?: string;
	syntax?: string;
	categoryName?: string;
	requiresDB?: boolean;
	execution: Function;
	commands?: ICommand[];
}

export interface ICategory {
	name: string;
	commands: ICommand[];
}
