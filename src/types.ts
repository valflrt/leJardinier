export interface Command {
	name: string,
	description: string,
	syntax: string,
	execution: Function
}