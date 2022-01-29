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

import { mix } from "../../../utils";

/**
 * Creates a database manager class with a default schema
 */
export default class DefaultManager<Schema> {
  private collection: Collection;

  protected schemaConstructor!: new () => Schema;

  constructor(database: Db, collectionName: string) {
    this.collection = database.collection(collectionName);
  }

  /**
   * Finds one entry
   * @param filter filter to find the entry
   * @param options optional – search options
   */
  public async findOne(
    filter: Partial<Schema>,
    options: FindOptions = {}
  ): Promise<Schema | null> {
    let doc = await this.collection.findOne(filter, options);
    return doc ? (doc as unknown as Schema) : null;
  }

  /**
   * Finds one entry, if not found creates one
   * @param filter filter to find the entry
   * @param doc object to create if nothing is found
   * @param options optional – search options
   */
  public async findOrCreateOne(
    filter: Partial<Schema>,
    doc: Schema,
    options: FindOptions = {}
  ): Promise<Schema | null> {
    let result = await this.collection.findOne(filter, options);
    if (!doc) {
      await this.createOne(doc);
      result = await this.collection.findOne(filter, options);
    }
    return result ? (result as unknown as Schema) : null;
  }

  /**
   * Finds multiples entries
   * @param filter filter to find the entries
   * @param options optional – search options
   */
  public async findMany(
    filter: Partial<Schema>,
    options: FindOptions = {}
  ): Promise<Schema[] | null> {
    let docs = await this.collection.find(filter, options).toArray();
    return docs.length !== 0 ? (docs as unknown[] as Schema[]) : null;
  }

  /**
   * Creates one entry
   * @param doc entry to create
   * @param options optional – creation options
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
   * Creates multiple entries from an object array
   * @param docs array of entries to create
   * @param options optional – creation options
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
   * Finds and deletes one entry
   * @param filter filter to find the target entry
   * @param options optional – delete options
   */
  public deleteOne(
    filter: Partial<Schema>,
    options: FindOneAndDeleteOptions = {}
  ): Promise<ModifyResult<any>> {
    return this.collection.findOneAndDelete(filter, options);
  }

  /**
   * Finds and replace one entry
   * @param filter filter to find the target entry
   * @param replacement replacement to apply to the target entry
   * @param options optional – replace options
   */
  public replaceOne(
    filter: Partial<Schema>,
    replacement: Schema,
    options: FindOneAndReplaceOptions = {}
  ): Promise<ModifyResult<any>> {
    return this.collection.findOneAndReplace(
      filter,
      mix(new this.schemaConstructor(), replacement),
      options
    );
  }

  /**
   * Updates an entry
   * @param filter filter to find the target entry
   * @param update update to apply to the target entry
   * @param options optional – update options
   */
  public updateOne(
    filter: Partial<Schema>,
    update: Partial<Schema>,
    options: FindOneAndUpdateOptions = {}
  ): Promise<ModifyResult<any>> {
    return this.collection.findOneAndUpdate(
      filter,
      { $set: mix(new this.schemaConstructor(), update) },
      options
    );
  }

  /**
   * Updates an entry and if not found creates one
   * @param filter filter to find target entry
   * @param update update to apply to the target entry
   * @param doc if not found, object to create the new entry with
   * @param options optional – update options
   */
  public async updateOrCreateOne(
    filter: Partial<Schema>,
    update: Partial<Schema>,
    doc: Schema,
    options: FindOneAndUpdateOptions = {}
  ): Promise<ModifyResult<any> | InsertOneResult<any>> {
    let targetEntry = await this.findOne(filter);
    if (!targetEntry)
      return await this.createOne(mix(new this.schemaConstructor(), doc));
    else
      return this.collection.findOneAndUpdate(
        filter,
        { $set: mix(new this.schemaConstructor(), update) },
        options
      );
  }

  /**
   * Returns a boolean wether the current manager is associated or not
   */
  public get associated(): boolean {
    return !!this.collection;
  }
}
