import secrets from "./secrets";
import local from "./local";

import { IConfig } from "../lib/types";

const config: IConfig = {
  version: "v3.3.1",
  local,
  secrets,
};

export default config;
