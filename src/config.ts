interface Config {
  apiUrl: string;
  placesUrl: string;
  paypalClientId: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  placesUrl: import.meta.env.VITE_PLACES_API_URL as string,
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID as string,
};

export default config;
