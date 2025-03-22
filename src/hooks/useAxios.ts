import { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (method: any, url: any, data = null, options = {}) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const config: any = {
        method,
        url,
        ...options,
      };

      if (method === "POST" || method === "PUT" || method === "PATCH") {
        config.data = data;
      }

      try {
        const result = await axios(config);
        setResponse(result.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.s");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { response, loading, error };
};

export default useAxios;
