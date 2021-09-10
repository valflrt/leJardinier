import { Low } from "lowdb/lib";
import database, { DBSchema } from "../database";

export default class Database {

	private DB: Low<DBSchema>;

	constructor() {
		this.DB = database;
		this.read().catch(err => console.log(err));
	}

	/**
	 * Reads database
	 * @returns {Promise} promise object
	 */
	private read = (): Promise<any> => this.DB.read();

	/**
	 * saves updated data to database
	 * @returns {Promise} promise object
	 */
	private save = (): Promise<any> => this.DB.write();

}