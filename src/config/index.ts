import "dotenv/config";

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
    prefix: process.env.PREFIX ?? "",
  },
  secrets: {
    token: process.env.TOKEN ?? "",
    youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
    databaseURI: process.env.DATABASE_URI ?? "",
  },
};

export default config;
