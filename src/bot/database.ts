import { Low } from "lowdb/lib";

import database from "../database";
import { SDB, SGuild } from "../database/schemas";

export default class Database {

	private DB: Low<SDB>;

	constructor() {
		this.DB = database;
		this.update();
	}

	/**
	 * Adds a guild to database
	 * @param guild {SGuild} guild to add
	 * @returns {Promise} promise object
	 */
	public addGuild = (guild: SGuild): Promise<any> => {
		this.update();
		this.DB.data
			?.guilds
			.push(guild);
		return this.save();
	}

	/**
	 * Gets a guild by id
	 * @param id id to look for
	 * @returns {SGuild}
	 */
	public getGuild = (id: string): SGuild | undefined => {
		this.update();
		return this.DB.data
			?.guilds
			.find(guild => guild.id === id);
	}

	/**
	 * Updates database instance
	 * @returns {Promise} promise object
	 */
	private update = (): Promise<any> => this.DB.read();

	/**
	 * Saves updated data to database
	 * @returns {Promise} promise object
	 */
	private save = (): Promise<any> => this.DB.write();

}