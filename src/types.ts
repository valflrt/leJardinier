import { MoreVideoDetails } from "ytdl-core";

export interface ICommand {
	name: string;
	description: string;
	arguments?: string;
	syntax?: string;
	categoryName?: string;
	requiresDB?: boolean;
	execution: Function;
	subcommands?: ICommand[];
}

export interface ICategory {
	name: string;
	commands: ICommand[];
}

export interface ISong {
	name: string;
	details: MoreVideoDetails;
}
