import { Message } from "discord.js";

export interface Command {
	name: string,
	description: string,
	syntax: string,
	execute: Function
}

export interface TMessage extends Message {

}