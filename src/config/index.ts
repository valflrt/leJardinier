import "dotenv/config";

const config = {
  prefix: process.env.PREFIX ?? "",
  secrets: {
    token: process.env.TOKEN ?? "",
    youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? "",
    databaseURI: process.env.DATABASE_URI ?? "",
    databaseName: process.env.DATABASE_NAME ?? "",
  },
};

export default config;
