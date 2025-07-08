interface Config {
  apiUrl: string;
  placesUrl: string;
  paypalClientId: string;
  supabaseUrl: string;
  supabaseKey: string;
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  placesUrl: import.meta.env.VITE_PLACES_API_URL as string,
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseKey: import.meta.env.VITE_SUPABASE_KEY as string,
};

export default config;
