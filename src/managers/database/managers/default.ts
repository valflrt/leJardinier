import {
	// classes
	Db,
	Collection,
	// output types
	Document,
	ModifyResult,
	InsertOneResult,
	InsertManyResult,
	// options
	FindOptions,
	FindOneAndDeleteOptions,
	FindOneAndReplaceOptions,
	FindOneAndUpdateOptions,
	InsertOneOptions,
	BulkWriteOptions,
} from "mongodb";

/**
 * mixes two objects of the same type
 * @param target target to mix the patch in
 * @param patch patch to mix in the target
 */
const mix = <TargetType>(target: TargetType, patch: TargetType): TargetType => {
	return Object.assign(target, patch) as TargetType;
};

/**
 * creates a database manager class with a default schema
 */
export default class DefaultManager<Schema> {
	private collection: Collection;

	protected schemaConstructor!: new () => Schema;

	constructor(database: Db, collectionName: string) {
		this.collection = database.collection(collectionName);
	}

	/**
	 * finds one entry
	 * @param filter filter to find the entries
	 * @param options search options
	 */
	public async findOne(
		filter: Partial<Schema>,
		options: FindOptions = {}
	): Promise<Schema | null> {
		let doc = await this.collection.findOne(filter, options);
		return doc ? (doc as unknown as Schema) : null;
	}

	/**
	 * finds multiples entries
	 * @param filter filter to find the entries
	 * @param options search options
	 */
	public async findMany(
		filter: Partial<Schema>,
		options: FindOptions = {}
	): Promise<Schema[] | null> {
		let docs = await this.collection.find(filter, options).toArray();
		return docs.length !== 0 ? (docs as unknown[] as Schema[]) : null;
	}

	/**
	 * creates one entry
	 * @param doc entry to create
	 * @param options creation options
	 */
	public createOne(
		doc: Schema,
		options: InsertOneOptions = {}
	): Promise<InsertOneResult<Document>> {
		return this.collection.insertOne(
			mix(new this.schemaConstructor(), doc),
			options
		);
	}

	/**
	 * creates multiple entries from an object array
	 * @param docs array of entries to create
	 * @param options creation options
	 */
	public createMany(
		docs: Schema[],
		options: BulkWriteOptions = {}
	): Promise<InsertManyResult<Document>> {
		return this.collection.insertMany(
			docs.map((doc) => mix(new this.schemaConstructor(), doc)),
			options
		);
	}

	/**
	 * finds and deletes one entry
	 * @param filter filter to find the target entry
	 * @param options delete options
	 */
	public deleteOne(
		filter: Partial<Schema>,
		options: FindOneAndDeleteOptions = {}
	): Promise<ModifyResult<unknown>> {
		return this.collection.findOneAndDelete(filter, options);
	}

	/**
	 * Finds and replace one entry
	 * @param filter filter to find the target entry
	 * @param replacement replacement to apply to the target entry
	 * @param options replace options
	 */
	public replaceOne(
		filter: Partial<Schema>,
		replacement: Schema,
		options: FindOneAndReplaceOptions = {}
	): Promise<ModifyResult<unknown>> {
		return this.collection.findOneAndReplace(
			filter,
			mix(new this.schemaConstructor(), replacement),
			options
		);
	}

	/**
	 * updates an entry
	 * @param filter filter to find the target entry
	 * @param update update to apply to the target entry
	 * @param options update options
	 */
	public updateOne(
		filter: Partial<Schema>,
		update: Partial<Schema>,
		options: FindOneAndUpdateOptions = {}
	): Promise<ModifyResult<unknown>> {
		return this.collection.findOneAndUpdate(
			filter,
			{ $set: mix(new this.schemaConstructor(), update) },
			options
		);
	}

	/**
	 * updates an entry and if not found creates one
	 * @param filter filter to find target entry
	 * @param update update to apply to the target entry
	 * @param doc if not found object to create the new entry with
	 * @param options update options
	 */
	public async updateOrCreateOne(
		filter: Partial<Schema>,
		update: Partial<Schema>,
		doc: Schema,
		options: FindOneAndUpdateOptions = {}
	): Promise<ModifyResult<unknown>> {
		let foundEntry = await this.findOne(filter);
		if (!foundEntry) await this.createOne(doc);
		return this.collection.findOneAndUpdate(
			filter,
			{ $set: mix(new this.schemaConstructor(), update) },
			options
		);
	}

	/**
	 * wether if the current manager is associated or not
	 */
	public get associated(): boolean {
		return !!this.collection;
	}
}
