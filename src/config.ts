interface Config {
  apiUrl: string;
  placesUrl: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  placesUrl: import.meta.env.VITE_PLACES_API_URL as string,
};

export default config;
