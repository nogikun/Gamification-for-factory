import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography } from '@mui/material'; // MUIのTypographyをインポート

// サンプルのデータセットとフォーマッター
// ご自身のプロジェクトのデータに合わせてインポートし直してください
import { dataset, valueFormatter } from '../dataset/chartData';

// グラフの共通設定
const chartSetting = {
  height: 400,
  legend: {
    position: 'top' as const,
  },
  // Y軸のラベルは削除し、タイトルとして上部に表示するため、ここでは設定しない
  yAxis: [{
    scaleType: 'linear' as const,
  }],
    margin: {
    right: 70, // 右側に40pxの余白を追加します。この数値を変更してお好みの余白に調整してください。
  },
};

// スタイル定義：グラフを中央寄せにする
const containerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};
const chartWrapperStyle = {
  width: '100%',
  maxWidth: '600px',
  boxSizing: 'border-box' as const,
};


export default function InternParticipantsVerticalBarChart() {
  return (
    <div style={containerStyle}>
      <div style={chartWrapperStyle}>
        {/* グラフタイトルをここに表示 */}
        <Typography
          variant="h6"
          component="h2"
          align="center"
          gutterBottom
        >
          インターン参加回数
        </Typography>

        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[{ dataKey: 'internParticipants', label: 'インターン参加回数', valueFormatter }]}
          {...chartSetting}
        />
      </div>
    </div>
  );
}