import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useServerConfig, useApiCall } from '@/hooks/useChart';
import { gameProgressData } from '@/dummy_data/chartData';
import axios from 'axios';

/**
 * ゲーム進捗APIレスポンスの型定義
 */
interface GameProgressResponse {
  value: number;
}

/**
 * GameProgressGaugeコンポーネントのProps型定義
 */
interface GameProgressGaugeProps {
  /** ユーザーID */
  userId: string;
  /** ゲージの幅（デフォルト: モバイル150px、デスクトップ200px） */
  width?: number;
  /** ゲージの高さ（デフォルト: モバイル150px、デスクトップ200px） */
  height?: number;
  /** タイトル */
  title?: string;
  /** タイトルの配置 */
  titleAlign?: 'left' | 'center' | 'right';
  /** 開始角度（デフォルト: -110度） */
  startAngle?: number;
  /** 終了角度（デフォルト: 110度） */
  endAngle?: number;
  /** コンテナの最大幅 */
  maxWidth?: string | number;
  /** コンテナの横方向の配置 */
  containerJustify?: 'flex-start' | 'center' | 'flex-end';
  /** フォーマット関数 */
  valueFormatter?: (value: number) => string;
}

/**
 * ゲーム進捗を円形ゲージで表示するコンポーネント
 * API取得、エラーハンドリング、エラーレポート機能を内蔵
 */
export function GameProgressGauge({
  userId,
  width,
  height,
  title = 'ゲーム進捗',
  titleAlign = 'center',
  startAngle = -110,
  endAngle = 110,
  maxWidth = '100%',
  containerJustify = 'center',
  valueFormatter = (value: number) => `${value}%`,
}: GameProgressGaugeProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { baseUrl } = useServerConfig();

  // レスポンシブな幅・高さの設定
  const gaugeWidth = width ?? (isMobile ? 150 : 200);
  const gaugeHeight = height ?? (isMobile ? 150 : 200);

  // API取得用のコールバック関数
  const fetchGameProgress = React.useCallback(async (): Promise<GameProgressResponse> => {
    const apiEndpoint = `${baseUrl}/charts/game_progress/${userId}`;
    const response = await axios.get<GameProgressResponse>(apiEndpoint);
    
    if (response.data?.value !== undefined) {
      return response.data;
    }
    
    // レスポンスが期待する形式でない場合はエラーを投げる
    throw new Error('Invalid API response format');
  }, [baseUrl, userId]);

  // useApiCallフックを使用してAPI取得とエラーハンドリングを管理
  const {
    data: progressData,
    isLoading,
    error,
    fetchData,
  } = useApiCall<GameProgressResponse>(
    gameProgressData, // 初期データ（ダミーデータ）
    fetchGameProgress,
    {
      userId,
      component: 'GameProgressGauge',
      functionName: 'fetchGameProgress',
      apiEndpoint: `${baseUrl}/charts/game_progress/${userId}`,
    }
  );

  // コンポーネントマウント時にデータを取得
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // スタイル定義をpropsから生成
  const containerStyle = {
    display: 'flex',
    justifyContent: containerJustify,
    width: '100%',
  };
  
  const wrapperStyle = {
    width: '100%',
    maxWidth: maxWidth,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <Typography
          variant="h6"
          component="h2"
          align={titleAlign}
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            mb: { xs: 2, md: 3 }
          }}
        >
          {title}
        </Typography>

        {isLoading && (
          <Typography variant="body2" color="text.secondary" sx={{ 
            textAlign: 'center', 
            mb: 1 
          }}>
            進捗を読み込み中...
          </Typography>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
              {error}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ダミーデータを表示しています
            </Typography>
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          my: { xs: 1, md: 2 },
          flex: 1,
        }}>
          <Gauge
            width={gaugeWidth}
            height={gaugeHeight}
            value={progressData.value}
            startAngle={startAngle}
            endAngle={endAngle}
            text={({ value }) => value !== null ? valueFormatter(value) : '0%'}
          />
        </Box>
      </div>
    </div>
  );
}

export default GameProgressGauge;
