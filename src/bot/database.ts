import { Low } from "lowdb/lib";
import database from "../database";

export default class Database {

	private DB: Low;

	constructor(DB: Low) {
		this.DB = DB;
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