import secrets from "./secrets";
import local from "./local";

import { IConfig } from "../types";

const config: IConfig = {
	version: "v3.2.2",
	local,
	secrets,
};

export default config;
