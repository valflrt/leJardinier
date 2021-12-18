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
	 * finds one object in the database using a filter based on the default
	 * specified schema
	 * @param filter typed filter
	 * @param options look up options
	 */
	public async findOne(
		filter: Partial<Schema>,
		options: FindOptions = {}
	): Promise<Schema | null> {
		let doc = await this.collection.findOne(filter, options);
		return doc ? (doc as unknown as Schema) : null;
	}

	public async findMany(
		filter: Partial<Schema>,
		options: FindOptions = {}
	): Promise<Schema[] | null> {
		let docs = await this.collection.find(filter, options).toArray();
		return docs.length !== 0 ? (docs as unknown[] as Schema[]) : null;
	}

	public createOne(
		doc: Schema,
		options: InsertOneOptions = {}
	): Promise<InsertOneResult<Document>> {
		return this.collection.insertOne(
			mix(new this.schemaConstructor(), doc),
			options
		);
	}

	public createMany(
		docs: Schema[],
		options: BulkWriteOptions = {}
	): Promise<InsertManyResult<Document>> {
		return this.collection.insertMany(
			docs.map((doc) => mix(new this.schemaConstructor(), doc)),
			options
		);
	}

	public deleteOne(
		filter: Partial<Schema>,
		options: FindOneAndDeleteOptions = {}
	): Promise<ModifyResult<unknown>> {
		return this.collection.findOneAndDelete(filter, options);
	}

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

	public updateOne(
		filter: Partial<Schema>,
		update: Partial<Schema>,
		options: FindOneAndUpdateOptions = {}
	): Promise<ModifyResult<unknown>> {
		return this.collection.findOneAndUpdate(
			filter,
			mix(new this.schemaConstructor(), update),
			options
		);
	}

	public get associated(): boolean {
		return !!this.collection;
	}
}
