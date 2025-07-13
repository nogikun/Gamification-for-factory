import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, CircularProgress, Alert } from '@mui/material';
import { useParticipationInternshipData } from '../hooks/useChartData';


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
  // デフォルトのテストユーザーIDを使用
  const userId = "11111111-1111-1111-1111-111111111111";
  const { data, loading, error } = useParticipationInternshipData(userId);


  // ローディング中の表示
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={chartWrapperStyle}>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            インターン参加回数
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={chartWrapperStyle}>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            インターン参加回数
          </Typography>
          <Alert severity="error" style={{ margin: '1rem 0' }}>
            データの取得に失敗しました: {error}
          </Alert>
        </div>
      </div>
    );
  }

  // データが存在しない場合
  if (!data || !data.internships || data.internships.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={chartWrapperStyle}>
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            インターン参加回数
          </Typography>
          <Alert severity="info" style={{ margin: '1rem 0' }}>
            表示するデータがありません
          </Alert>
        </div>
      </div>
    );
  }

  // データ加工
  const chartData = data.internships.map(item => ({
    month: item.month,
    internParticipants: item.internParticipants
  }));
  
  return (
    <div style={containerStyle}>
      <div style={chartWrapperStyle}>
        <Typography variant="h6" component="h2" align="center" gutterBottom>
          インターン参加回数
        </Typography>

        <BarChart
          dataset={chartData}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[{ 
            dataKey: 'internParticipants', 
            label: 'インターン参加回数', 
            valueFormatter: (value) => {
              if (value === null || value === undefined) {
                return '0回';
              }
              return `${value}回`;
            }
          }]}
          {...chartSetting}
        />
      </div>
    </div>
  );
}