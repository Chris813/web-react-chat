import axios from "axios";
import { useRef, useState } from "react";

type AxiosProps<T> = {
  url: string;
  method: "get" | "post" | "put" | "delete";
  payload?: T;
};

export default function useAxios<T>({ url, method, payload }: AxiosProps<T>) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.request({
        signal: controllerRef.current.signal,
        data: payload,
        method,
        url,
      });

      setData(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { cancel, data, error, loading, sendRequest };
}
