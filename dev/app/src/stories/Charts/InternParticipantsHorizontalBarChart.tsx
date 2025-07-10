import * as React from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Box } from '@mui/material';
import { dataset, valueFormatter } from '../../dummy_data/chartData';
import { useServerConfig, useErrorReporting } from '../../hooks/useChart';

/**
 * インターン参加データの型定義
 */
export interface InternParticipantsData {
  month: string;
  internParticipants: number;
  [key: string]: string | number; // インデックスシグネチャを追加
}

// APIレスポンスの型定義
interface ApiInternParticipantsData {
  month: string;
  participants: number;
}

interface ApiParticipationResponse {
  internships: ApiInternParticipantsData[];
}

/**
 * インターン参加者横棒グラフの表示プロパティ
 */
export interface InternParticipantsHorizontalBarChartProps {
  /** グラフデータの配列 */
  data?: InternParticipantsData[];
  /** グラフのタイトル */
  title?: string;
  /** グラフの高さ */
  height?: number;
  /** グラフの最大幅 */
  maxWidth?: string | number;
  /** 全体の幅 */
  width?: string | number;
  /** タイトルの配置 */
  titleAlign?: 'left' | 'center' | 'right';
  /** 右側の余白 */
  rightMargin?: number;
  /** データキーのラベル */
  dataLabel?: string;
  /** 凡例の位置 */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** コンテナの配置 */
  containerJustify?: 'flex-start' | 'center' | 'flex-end';
  /** 値のフォーマッター関数 */
  valueFormatter?: (value: number | null) => string;
  /** ユーザーID（APIからデータを取得する場合） */
  userId?: string;
}

/**
 * インターン参加者の横棒グラフを表示するコンポーネント
 */
export default function InternParticipantsHorizontalBarChart({
  data = dataset,
  title = "インターン参加回数",
  height = 400,
  maxWidth = '600px',
  width = '100%',
  titleAlign = 'center',
  rightMargin = 70,
  dataLabel = 'インターン参加回数',
  legendPosition = 'top',
  containerJustify = 'center',
  valueFormatter: customValueFormatter = valueFormatter,
  userId = "11111111-1111-1111-1111-111111111111", // デフォルトユーザーID
}: InternParticipantsHorizontalBarChartProps) {
  // Hooksを使用
  const { baseUrl } = useServerConfig();
  const { sendApiErrorReport } = useErrorReporting();
  
  // ステート管理
  const [participationData, setParticipationData] = React.useState<InternParticipantsData[]>(data);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // APIからデータを取得する関数
  const fetchParticipationData = React.useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    const apiEndpoint = `${baseUrl}/charts/participation_internship/${userId}`;
    
    try {
      const response = await axios.get<ApiParticipationResponse>(apiEndpoint);
      if (response.data?.internships) {
        // APIデータをInternParticipantsData形式に変換
        const convertedData: InternParticipantsData[] = response.data.internships.map(apiData => ({
          month: apiData.month,
          internParticipants: apiData.participants,
        }));
        setParticipationData(convertedData);
      }
    } catch (err) {
      console.error('Failed to fetch participation data:', err);
      
      // エラーレポートを送信
      await sendApiErrorReport(err, {
        user_id: userId,
        api_endpoint: apiEndpoint,
        request_method: 'GET',
        component: 'InternParticipantsHorizontalBarChart',
        function: 'fetchParticipationData',
      });
      
      setError('データの取得に失敗しました');
      // エラー時はプロップスのデータを使用
      setParticipationData(data);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, userId, data, sendApiErrorReport]);

  // コンポーネントマウント時にデータを取得
  React.useEffect(() => {
    fetchParticipationData();
  }, [fetchParticipationData]);

  // グラフの設定をpropsから生成
  const chartSetting = {
    height: height,
    legend: {
      position: legendPosition,
    },
    yAxis: [{
      scaleType: 'linear' as const,
    }],
    margin: {
      right: rightMargin,
      left: 10, // 左側の余白も調整
      top: 10, // 上部の余白
      bottom: 20, // 下部の余白
    },
    layout: 'vertical' as const, // 縦方向レイアウト
  } as const;

  // スタイル定義をpropsから生成
  const containerStyle = {
    width: width,
    display: 'flex',
    justifyContent: containerJustify,
  };
  
  const chartWrapperStyle = {
    width: '100%',
    maxWidth: maxWidth,
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={containerStyle}>
      <div style={chartWrapperStyle}>
        <Typography
          variant="h6"
          component="h2"
          align={titleAlign}
          gutterBottom
        >
          {title}
        </Typography>

        {isLoading && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              データを読み込み中...
            </Typography>
          </Box>
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

        <BarChart
          dataset={participationData}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[{ 
            dataKey: 'internParticipants', 
            label: dataLabel, 
            valueFormatter: customValueFormatter 
          }]}
          {...chartSetting}
        />
      </div>
    </div>
  );
}
