import "dotenv/config";

const config = {
  prefix: process.env.PREFIX ?? "",
  secrets: {
    token: process.env.TOKEN ?? "",
    youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
    databaseURI: process.env.DATABASE_URI ?? "",
  },
};

export default config;
