'use client';

import { useState, useEffect, useCallback } from 'react';
import { AQIData, CitySearchResult, RecommendationResponse, UserContext } from '@/types';

interface UseAQIDataReturn {
  data: AQIData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchByCoords: (lat: number, lon: number, cityName?: string) => Promise<void>;
}

export function useAQIData(initialCity: string = 'Delhi', initialCountry: string = 'IN'): UseAQIDataReturn {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCityData = useCallback(async (c: string, cntry: string) => {
    if (!c || c.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/aqidata?city=${encodeURIComponent(c.trim())}&country=${encodeURIComponent(cntry.trim())}`
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch air quality data');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading air quality data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`/api/aqidata?city=${encodeURIComponent(initialCity.trim())}&country=${encodeURIComponent(initialCountry.trim())}`)
      .then(res => res.json())
      .then(res => {
        if (!active) return;
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'An error occurred while loading air quality data');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialCity, initialCountry]);

  const fetchByCoords = useCallback(async (lat: number, lon: number, cityName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const cityParam = cityName ? `&cityName=${encodeURIComponent(cityName)}` : '';
      const response = await fetch(`/api/aqidata?lat=${lat}&lon=${lon}${cityParam}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch air quality data for location');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GPS air quality data');
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    data, 
    loading, 
    error, 
    refetch: () => fetchCityData(initialCity, initialCountry),
    fetchByCoords
  };
}

interface UseRecommendationsReturn {
  data: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
  generate: (aqiData: AQIData, userContext: UserContext) => Promise<void>;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (aqiData: AQIData, userContext: UserContext) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aqiData, userContext }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate recommendations');
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, generate };
}

export function useCitySearch() {
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/aqidata?action=search&q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.cities || []);
      }
    } catch (err) {
      console.error('Error during city autocomplete:', err);
    } finally {
      setSearching(false);
    }
  }, []);

  return { results, searching, search, clear: () => setResults([]) };
}
