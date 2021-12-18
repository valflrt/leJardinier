import { MongoClient } from "mongodb";

import managers from "./managers";
import config from "../../config";

const buildDatabase = async (): Promise<void> => {
	const client = new MongoClient(config.secrets.databaseURI);
	await client.connect();
	managers.associate(client.db("lejardinier"));
};

export default buildDatabase;
