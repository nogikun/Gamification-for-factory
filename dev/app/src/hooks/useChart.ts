/**
 * コンポーネント間で共有するカスタムHook
 * Redux設定取得とエラーレポート機能を提供
 */
import { useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import { sendErrorReport, createErrorReportFromAxiosError } from '../utils/errorReporting';

// Redux storeの型定義
interface RootState {
  server: {
    host: string;
    port: string;
  };
}

/**
 * Redux storeからサーバー設定を取得するカスタムHook
 * @returns サーバー設定情報（host, port, baseUrl）
 */
export const useServerConfig = () => {
  const { host, port } = useSelector((state: RootState) => state.server);
  
  const baseUrl = useMemo(() => {
    return port ? `${host}:${port}` : host;
  }, [host, port]);
  
  return { host, port, baseUrl };
};

/**
 * エラーレポート機能を提供するカスタムHook
 * @returns エラーレポート送信関数
 */
export const useErrorReporting = () => {
  const sendApiErrorReport = useCallback(async (
    error: unknown,
    context: {
      user_id?: string;
      api_endpoint?: string;
      request_method?: string;
      component?: string;
      function?: string;
    }
  ) => {
    try {
      const errorReport = createErrorReportFromAxiosError(error, context);
      await sendErrorReport(errorReport);
    } catch (reportError) {
      console.error('Failed to send error report:', reportError);
    }
  }, []);
  
  return { sendApiErrorReport };
};

/**
 * API取得の共通ステート管理パターンを提供するHook
 */
export const useApiState = <T>(initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
  }, [initialData]);
  
  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    error,
    setError,
    reset,
  };
};

/**
 * 共通のAPI取得パターンを提供するHook
 */
export const useApiCall = <T>(
  initialData: T,
  apiCall: () => Promise<T>,
  options: {
    userId?: string;
    component?: string;
    functionName?: string;
    apiEndpoint?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) => {
  const { data, setData, isLoading, setIsLoading, error, setError } = useApiState(initialData);
  const { sendApiErrorReport } = useErrorReporting();
  
  const fetchData = useCallback(async () => {
    if (!options.userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      console.error(`Failed to fetch data in ${options.component}:`, err);
      
      // エラーレポートを送信
      await sendApiErrorReport(err, {
        user_id: options.userId,
        api_endpoint: options.apiEndpoint,
        request_method: 'GET',
        component: options.component,
        function: options.functionName,
      });
      
      const errorMessage = err instanceof Error ? err.message : 'データの取得に失敗しました';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      // エラー時は初期データを使用
      setData(initialData);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, options, initialData, sendApiErrorReport, setData, setIsLoading, setError]);
  
  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
  }, [initialData, setData, setIsLoading, setError]);
  
  return {
    data,
    isLoading,
    error,
    fetchData,
    reset,
  };
};

// Copyright (c) 2025 nogi
// All rights reserved.
