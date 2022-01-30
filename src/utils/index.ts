/**
 * Return one of the given items randomly
 * @param array item array
 */
export const randomItem = (...array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

/**
 * Returns a random number between min and max
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
 * Returns process's RAM usage
 */
export function memoryUsage() {
  const memory = process.memoryUsage();
  return `${(memory.heapUsed / 1000 / 1000).toFixed(2)}/${(
    memory.heapTotal /
    1000 /
    1000
  ).toFixed(2)}MB`;
}

/**
 * Mixes two objects of the same type
 * @param target target to mix the patch in
 * @param patch patch to mix in the target
 */
export const mix = <TargetType, PatchType>(
  target: TargetType,
  patch: PatchType
): TargetType => {
  return Object.assign(target, patch) as TargetType;
};

export const loops = {
  /**
   * Similar to a for loop but using recursion
   * @param callback function called at every iteration
   * @param iterations number of iterations to do
   */
  for: <T>(callback: (i: number) => T, iterations: number = 0): T | void => {
    let loop = (i: number = 0): T | void => {
      let result = callback(i);
      i++;
      if (i === iterations) return result;
      else return loop(i);
    };
    return loop();
  },
};
