import mongoose from "mongoose";

import config from "../config/database";

import guild from "../database/schemas/guild";

class Database {

	public connect = () => mongoose.connect(config.databaseURI);

	public findById = async (id: string) => {
		return await guild.findOne({ id: id })
	}

}

export default new Database();