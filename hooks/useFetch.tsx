
"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const useFetch = <T,>(
  url: string,
  method = "GET",
  option: Record<string, unknown> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const optionString = JSON.stringify(option);

  const requestOption = useMemo(() => {
    const options = { ...option };

    if (method === "POST" && !options.data) {
      options.data = {};
    }

    return options;
  }, [method, optionString]);

  useEffect(() => {
    let cancelled = false;

    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await axios<ApiResponse<T>>({
          url,
          method,
          ...requestOption,
        });

        if (!response.success) {
          throw new Error(response.message ?? "Request failed");
        }

        if (!cancelled) {
          setData(response.data as T);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    apiCall();

    return () => {
      cancelled = true;
    };
  }, [url, method, requestOption, refreshIndex]);

  const refresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  return { data, loading, error, refresh };
};
