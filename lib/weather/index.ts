import { MockWeatherAdapter } from './mock-weather.adapter';
import type { WeatherProvider } from './weather.interface';

function createWeatherProvider(): WeatherProvider {
  if (process.env.OPENWEATHER_API_KEY) {
    console.log('[Weather] OpenWeather API key detected. Live weather adapter planned for future release.');
  }
  return new MockWeatherAdapter();
}

export const weatherProvider: WeatherProvider = createWeatherProvider();
