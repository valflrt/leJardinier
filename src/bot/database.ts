import { MongoClient, Collection } from "mongodb";

import config from "../config/database";

class Database {

	private client: MongoClient;
	private DB: Collection<Document> | undefined;

	constructor() {
		this.client = new MongoClient(config.databaseURI);
	}

	public connect = () => new Promise<void>(async (resolve) => {
		try {
			let connection = await this.client.connect();

			this.DB = connection
				.db("lejardinier")
				.collection("main");

			resolve();
		} catch (e) { console.log(e) };
	})

}

export default new Database();