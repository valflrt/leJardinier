import { connect } from "mongoose";

import config from "../../config";

export const connectDatabase = () => {
  return connect(config.secrets.databaseURI);
};
