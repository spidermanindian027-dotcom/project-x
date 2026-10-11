export interface WeatherData {
  city: string;
  temperatureC: number;
  condition: string;
  description: string;
  season: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  isDevelopmentAdapter: boolean;
}

export interface WeatherProvider {
  readonly providerName: string;
  getWeatherForLocation(location?: string, coords?: { lat: number; lon: number }): Promise<WeatherData>;
}
