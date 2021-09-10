import { Low, JSONFile } from "lowdb";

import { SDB } from "./schemas";

let basePath = `${__dirname}database/databases/`;

export default new Low<SDB>(new JSONFile<SDB>(basePath.concat("database.json")));