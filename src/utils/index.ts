import { EmbedFieldData } from "discord.js";
import { blockQuote, bold, inlineCode, quote } from "@discordjs/builders";

import CCommand from "../lib/command/classes/command";

/**
 * return one of the given items randomly
 * @param array item array
 */
export const randomItem = (...array: any[]) =>
	array[Math.floor(Math.random() * array.length)];

/**
 * returns a random number between min and max
 * @param min minimum number
 * @param max maximum number
 */
export const randomNumber = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Has one chance of specified total to return true, otherwise returns false
 * @param total total number (one chance on total)
 */
export const oneOf = (total: number): boolean =>
	Math.floor(Math.random() * total) === 1 ? true : false;

/**
 * returns process's RAM usage
 */
export function memoryUsage() {
	const memory = process.memoryUsage();
	return `${(memory.heapUsed / 1000 / 1000).toFixed(2)}/${(
		memory.heapTotal /
		1000 /
		1000
	).toFixed(2)}MB`;
}
