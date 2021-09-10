import { MongoClient, Collection } from "mongodb";

import config from "../config/database";

class Database {

	private client: MongoClient;
	private DB: Collection<Document> | undefined;

	constructor() {
		this.client = new MongoClient(config.databaseURI);
		this.connect();
	}

	private connect = async () => {
		let connection = await this.client.connect();
		this.DB = connection
			.db("lejardinier")
			.collection("main");
	}

}

export default new Database;