import type { WeatherData, WeatherProvider } from './weather.interface';

const PRESET_CITIES: Record<string, { temp: number; cond: string; desc: string; season: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' }> = {
  paris: { temp: 18, cond: 'Mild Overcast', desc: 'Cool Parisian breeze with soft cloud cover.', season: 'AUTUMN' },
  milan: { temp: 22, cond: 'Clear Sunny', desc: 'Crisp Lombardy sunshine with mild humidity.', season: 'SPRING' },
  london: { temp: 15, cond: 'Light Rain', desc: 'Classic London drizzle with cool pavement temperatures.', season: 'AUTUMN' },
  'new york': { temp: 16, cond: 'Autumn Breeze', desc: 'Brisk metropolitan air with dry clarity.', season: 'AUTUMN' },
  tokyo: { temp: 21, cond: 'Fair & Mild', desc: 'Pleasant temperate clarity across the capital.', season: 'SPRING' },
  mumbai: { temp: 29, cond: 'Tropical Humid', desc: 'Warm coastal atmosphere with bright skies.', season: 'SUMMER' },
  berlin: { temp: 13, cond: 'Chilly Grey', desc: 'Subdued overcast with brisk European wind.', season: 'AUTUMN' },
  dubai: { temp: 34, cond: 'Dry Heat', desc: 'Warm desert sun with intense daylight.', season: 'SUMMER' },
};

export class MockWeatherAdapter implements WeatherProvider {
  readonly providerName = 'mock_geocoding_climate';

  async getWeatherForLocation(
    location?: string,
    coords?: { lat: number; lon: number }
  ): Promise<WeatherData> {
    console.warn(
      '[MockWeatherAdapter] Warning: Using simulated development climate adapter. Configure OPENWEATHER_API_KEY for live meteorological ingestion.'
    );

    const query = (location || '').trim().toLowerCase();

    // Check predefined cities
    for (const [key, val] of Object.entries(PRESET_CITIES)) {
      if (query.includes(key)) {
        return {
          city: key.toUpperCase(),
          temperatureC: val.temp,
          condition: val.cond,
          description: val.desc,
          season: val.season,
          isDevelopmentAdapter: true,
        };
      }
    }

    if (coords) {
      const lat = coords.lat;
      const temp = Math.round(15 + (Math.abs(lat) % 15));
      return {
        city: location ? location.toUpperCase() : 'DEVICE REGION',
        temperatureC: temp,
        condition: temp > 22 ? 'Warm Sunshine' : 'Temperate Overcast',
        description: `Coordinates (${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}) localized climate index.`,
        season: temp > 22 ? 'SUMMER' : 'AUTUMN',
        isDevelopmentAdapter: true,
      };
    }

    // Default Fallback
    const fallbackCity = location ? location.toUpperCase() : 'PARIS ATELIER';
    return {
      city: fallbackCity,
      temperatureC: 19,
      condition: 'Mild Autumn Breezes',
      description: 'Temperate climate ideal for lightweight tailoring and layered textures.',
      season: 'AUTUMN',
      isDevelopmentAdapter: true,
    };
  }
}
