'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AQIData, CitySearchResult, RecommendationResponse, UserContext } from '@/types';

interface UseAQIDataReturn {
  data: AQIData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchByCoords: (lat: number, lon: number, cityName?: string) => Promise<void>;
}

/** Fetches and caches live AQI telemetry for a target city or GPS coordinates with request cancellation. */
export function useAQIData(
  initialCity: string = 'Delhi',
  initialCountry: string = 'IN'
): UseAQIDataReturn {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(async (url: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, { signal });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch air quality data');
      }
      setData(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(
        err instanceof Error ? err.message : 'An error occurred while loading air quality data'
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const fetchCityUrl = useCallback((city: string, country: string) => {
    return `/api/aqidata?city=${encodeURIComponent(city.trim())}&country=${encodeURIComponent(country.trim())}`;
  }, []);

  useEffect(() => {
    if (!initialCity.trim()) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        void executeFetch(fetchCityUrl(initialCity, initialCountry), controller.signal);
      }
    });

    return () => {
      controller.abort();
    };
  }, [initialCity, initialCountry, executeFetch, fetchCityUrl]);

  const refetch = useCallback(async () => {
    if (!initialCity.trim()) return;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    await executeFetch(fetchCityUrl(initialCity, initialCountry), controller.signal);
  }, [initialCity, initialCountry, executeFetch, fetchCityUrl]);

  const fetchByCoords = useCallback(
    async (lat: number, lon: number, cityName?: string) => {
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;
      const cityParam = cityName ? `&cityName=${encodeURIComponent(cityName)}` : '';
      await executeFetch(`/api/aqidata?lat=${lat}&lon=${lon}${cityParam}`, controller.signal);
    },
    [executeFetch]
  );

  return { data, loading, error, refetch, fetchByCoords };
}

interface UseRecommendationsReturn {
  data: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
  generate: (aqiData: AQIData, userContext: UserContext) => Promise<void>;
}

/** Generates context-aware GenAI guidance while cancelling superseded in-flight requests. */
export function useRecommendations(): UseRecommendationsReturn {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (aqiData: AQIData, userContext: UserContext) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData, userContext }),
        signal: controller.signal,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate recommendations');
      }

      setData(result);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(
        err instanceof Error ? err.message : 'An error occurred while generating recommendations'
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { data, loading, error, generate };
}

/** Debounced global city autocomplete search hook with automatic request cancellation. */
export function useCitySearch() {
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/aqidata?action=search&q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.cities || []);
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Error during city autocomplete:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 250);
  }, []);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
    setResults([]);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return { results, searching, search, clear };
}
