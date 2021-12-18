import { MongoClient } from "mongodb";

import database from ".";
import config from "../../config";

const buildDatabase = async (): Promise<void> => {
	const client = new MongoClient(config.secrets.databaseURI);
	await client.connect();
	database.associate(client.db("lejardinier"));
};

export default buildDatabase;
