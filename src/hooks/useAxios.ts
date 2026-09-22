import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";

axios.defaults.withCredentials = true;

interface UseAxiosState<T> {
  response: T | null;
  loading: boolean;
  error: string | null;
}

const useAxios = <T = any>(
  method: Method,
  url: string,
  data: any = null,
  options: AxiosRequestConfig = {}
): UseAxiosState<T> => {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const config: AxiosRequestConfig = {
        method,
        url,
        data,
        withCredentials: true, 
        signal: controller.signal,
        ...options,
      };

      try {
        const result = await axios(config);
        setResponse(result.data);
      } catch (err: any) {
        if (axios.isCancel(err)) return; 
        
        const errorMessage =
          err.response?.data?.message || err.message || "Something went wrong.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [url, method, JSON.stringify(data)]); // Safe comparison para sa data dependencies

  return { response, loading, error };
};

export default useAxios;
