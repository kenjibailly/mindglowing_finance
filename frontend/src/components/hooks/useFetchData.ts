import { useState } from "react";

interface FetchDataOptions {
  id: string | undefined;
  endpoint: string;
  dataKey: string; // the key in the response object for the desired data, e.g., "customer" or "product"
}

const useFetchData = <T>({ id, endpoint, dataKey }: FetchDataOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/${endpoint}/${id}`);
      const responseData = await response.json();
      if (response.ok) {
        setData(responseData[dataKey]);
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchItems };
};

export default useFetchData;
