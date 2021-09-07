export class Collection {

	private collection: any[][];

	constructor(collection: any[][]) {
		this.collection = collection;
	}

	/**
	 * same as set in a map
	 * @param key key to set
	 * @param value value to assign to key
	 */
	public set = (key: any, value: any) => {
		if (!this.has(key)) this.collection.push(key, value);
		else throw new Error("Can't have two same keys");
	}

	/**
	 * same as has in a map
	 * @param key key to look for
	 * @returns boolean: whether collection has item or not
	 */
	public has = (key: any): any => {
		return this.collection.some(item => item[0] === key);
	}

	/**
	 * same as get in a map
	 * @param key key to look for
	 * @returns corresponding item
	 */
	public get = (key: any): any => {
		return this.collection.find(item => item[0] === key);
	}

}