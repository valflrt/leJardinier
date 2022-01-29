import axios from "axios";

import config from "../../config";

interface IWeather {
  coord: { lon: number; lat: number };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  name: string;
}

class OpenWeatherAPI {
  /**
   * Fetches the weather in a specific place
   * @param place requested place where to fetch the weather
   * @param units optional – weather units
   */
  public async fetchWeather(
    place: string,
    units?: "metric" | "standard"
  ): Promise<IWeather | null> {
    let res = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?"
        .concat(`q=${encodeURIComponent(place)}&`) // parse requested place to url-safe string
        .concat(units ? `units=${units}&` : "")
        .concat(`lang=en&`)
        .concat(`appid=${config.secrets.openWeatherApiKey}`)
    );
    if (res.status === 200) return res.data;
    else return null;
  }
}

const openWeatherAPI = new OpenWeatherAPI();

export default openWeatherAPI;
