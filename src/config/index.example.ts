interface IConfig {
  local: {
    prefix: string;
  };
  secrets: {
    token: string;
    youtubeApiKey: string;
    databaseURI: string;
  };
}

const config: IConfig = {
  local: {
    prefix: "prefix",
  },
  secrets: {
    token: "bot token",
    youtubeApiKey: "youtube api key",
    databaseURI: "mongodb database URI",
  },
};

export default config;
