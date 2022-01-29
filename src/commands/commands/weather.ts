import Command from "../../features/commands/classes/command";

import reactions from "../../assets/reactions";
import openWeatherAPI from "../../features/apis/openweather";
import { blockQuote, inlineCode } from "@discordjs/builders";

const weather_cmd = new Command({
  name: "weather",
  description: "Gives the weather in a specific location",
  parameters: [{ name: "location", required: true }],
  execution: async ({ actions, attributes }) => {
    let weather = {
      metricUnits: await openWeatherAPI.fetchWeather(
        attributes.parameters,
        "metric"
      ),
      standardUnits: await openWeatherAPI.fetchWeather(
        attributes.parameters,
        "standard"
      ),
    };

    let weatherInfo =
      weather.metricUnits && weather.metricUnits.weather.length !== 0
        ? weather.metricUnits.weather[0]
        : null;

    if (!weather.metricUnits || !weather.standardUnits || !weatherInfo)
      return actions.sendTextEmbed(
        `${reactions.error.random} Failed to get weather information, the city you requested may be unknown.`
      );

    actions.sendCustomEmbed((e) =>
      e
        .setDescription(
          `Here is the weather in: ${inlineCode(attributes.parameters)} ${
            reactions.smile.random
          }\n\n`.concat(
            `**${weatherInfo?.main ?? "unknown"}**\n`.concat(
              blockQuote(
                `Description: ${inlineCode(
                  weatherInfo?.description ?? "unknown"
                )}\n`
                  .concat(
                    `Temperature: ${inlineCode(
                      `${weather.metricUnits?.main.temp ?? "unknown "}°C / ${
                        weather.standardUnits?.main.temp ?? "unknown "
                      }°K`
                    )}`
                  )
                  .concat(
                    `Wind: ${inlineCode(
                      weather.metricUnits?.wind.speed.toString() ?? "unknown "
                    )}m/sec`
                  )
              )
            )
          )
        )
        .setThumbnail(
          `https://openweathermap.org/img/wn/${weatherInfo?.icon ?? ""}@2x.png`
        )
    );
  },
});

export default weather_cmd;
