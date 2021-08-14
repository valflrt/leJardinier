export function memoryUsage() {
	const memory = process.memoryUsage();
	return `${(memory.heapUsed / 1000 / 1000).toFixed(2)}/${(memory.heapTotal / 1000 / 1000).toFixed(2)}MB`;
}