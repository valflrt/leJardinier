/**
 * return one of the arguments randomly
 * @param array argument item array
 * @returns random item
 */
export const randomItem = (...array: any[]) =>
	array[Math.floor(Math.random() * array.length)];

/**
 * returns a random number between min and max
 * @param min minimum number
 * @param max maximum number
 * @returns number
 */
export const randomNumber = (min: number, max: number): number =>
	Math.floor(Math.random() * (max - min + 1) + min);

/**
 * returns process's RAM usage
 * @returns string of RAM usage
 */
export function memoryUsage() {
	const memory = process.memoryUsage();
	return `${(memory.heapUsed / 1000 / 1000).toFixed(2)}/${(memory.heapTotal / 1000 / 1000).toFixed(2)}MB`;
}