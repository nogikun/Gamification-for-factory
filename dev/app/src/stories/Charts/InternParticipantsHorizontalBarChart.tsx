import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material';
import { dataset, valueFormatter } from '../../dataset/chartData';

/**
 * インターン参加データの型定義
 */
export interface InternParticipantsData {
  month: string;
  internParticipants: number;
  [key: string]: string | number; // インデックスシグネチャを追加
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
}: InternParticipantsHorizontalBarChartProps) {
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
    },
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

        <BarChart
          dataset={data}
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
