import secrets from "./secrets";
import local from "./local";

import { IConfig } from "../declarations/types";

const config: IConfig = {
  version: "v3.4.0",
  local,
  secrets,
};

export default config;
