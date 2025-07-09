import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// API response types
interface ParticipationInternshipData {
  month: string;
  internParticipants: number;
}

interface ParticipationInternshipsResponse {
  internships: ParticipationInternshipData[];
}

interface GameProgressResponse {
  value: number;
}

interface GameLogItemData {
  date: string;
  icon: string;
  color: string;
  text: string;
}

interface GameLogsResponse {
  logs: GameLogItemData[];
}

interface CompanyEvaluationData {
  id: string;
  companyName: string;
  rating: number;
}

interface CompanyEvaluationsResponse {
  evaluations: CompanyEvaluationData[];
}

// Hook result types
interface UseChartDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE_URL = 'http://localhost:3000';

// Generic fetch function
const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Custom hook for fetching chart data
const useChartData = <T>(endpoint: string): UseChartDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData<T>(endpoint);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchChartData
  };
};

// Specific hooks for each chart type
export const useParticipationInternshipData = (userId: string = 'test-user') => {
  return useChartData<ParticipationInternshipsResponse>(`/charts/participation_internship/${userId}`);
};

export const useGameProgressData = (userId: string = 'test-user') => {
  return useChartData<GameProgressResponse>(`/charts/game_progress/${userId}`);
};

export const useGameLogsData = (userId: string = 'test-user') => {
  return useChartData<GameLogsResponse>(`/charts/game_logs/${userId}`);
};

export const useCompanyEvaluationsData = (userId: string = 'test-user') => {
  return useChartData<CompanyEvaluationsResponse>(`/charts/company_evaluations/${userId}`);
};

// Export types for components
export type {
  ParticipationInternshipData,
  ParticipationInternshipsResponse,
  GameProgressResponse,
  GameLogItemData,
  GameLogsResponse,
  CompanyEvaluationData,
  CompanyEvaluationsResponse,
  UseChartDataResult
};