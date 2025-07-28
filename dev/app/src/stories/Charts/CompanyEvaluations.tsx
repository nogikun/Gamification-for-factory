import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { companyEvaluations, CompanyEvaluationData } from '../../dummy_data/chartData';

// APIレスポンスの型定義
interface ApiCompanyEvaluationData {
  id: string;
  companyName: string;
  rating: number;
}

interface ApiCompanyEvaluationsResponse {
  evaluations: ApiCompanyEvaluationData[];
}

/**
 * 企業評価の表示プロパティ
 */
export interface CompanyEvaluationsProps {
  /** 企業評価データの配列 */
  evaluations?: CompanyEvaluationData[];
  /** セクションのタイトル */
  title?: string;
  /** 評価の最大値 */
  maxRating?: number;
  /** 評価の精度（ステップ値） */
  precision?: number;
  /** カードの表示スタイル */
  variant?: 'outlined' | 'elevation';
  /** カードの影の深度（variant='elevation'の場合のみ有効） */
  elevation?: number;
  /** カードの角の丸み */
  borderRadius?: number;
  /** 外側の余白 */
  padding?: number;
  /** 内側の余白 */
  innerPadding?: number;
  /** ユーザーID（APIからデータを取得する場合） */
  userId?: string;
}

/**
 * 企業からの評価リストを表示するコンポーネント
 */
export default function CompanyEvaluations({
  evaluations = companyEvaluations,
  title = "企業からの評価",
  maxRating = 5,
  precision = 0.5,
  variant = 'elevation',
  elevation = 2,
  borderRadius = 2,
  padding = 2,
  innerPadding = 2,
  userId = "11111111-1111-1111-1111-111111111111", // デフォルトユーザーID
}: CompanyEvaluationsProps) {
  // Redux storeからサーバー設定を取得
  const { host, port } = useSelector((state: any) => state.server);
  
  // ベースURLを構築
  const baseUrl = React.useMemo(() => {
    return port ? `${host}:${port}` : host;
  }, [host, port]);
  
  // ステート管理
  const [evaluationData, setEvaluationData] = React.useState<CompanyEvaluationData[]>(evaluations);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // APIからデータを取得する関数
  const fetchEvaluations = React.useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<ApiCompanyEvaluationsResponse>(`${baseUrl}/charts/company_evaluations/${userId}`);
      if (response.data?.evaluations) {
        // APIデータをCompanyEvaluationData形式に変換
        const convertedEvaluations: CompanyEvaluationData[] = response.data.evaluations.map(apiEval => ({
          id: apiEval.id,
          companyName: apiEval.companyName,
          rating: apiEval.rating,
        }));
        setEvaluationData(convertedEvaluations);
      }
    } catch (err) {
      console.error('Failed to fetch company evaluations:', err);
      setError('企業評価の取得に失敗しました');
      // エラー時はダミーデータを使用
      setEvaluationData(evaluations);
    } finally {
      setIsLoading(false);
    }
  }, [userId, evaluations, baseUrl]);

  // コンポーネントマウント時にデータを取得
  React.useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Paper 
        variant={variant}
        elevation={variant === 'elevation' ? elevation : 0}
        sx={{ 
          borderRadius: borderRadius, 
          p: innerPadding, 
          width: '100%',
          maxWidth: '100%' 
        }}
      >
        <Typography variant="h6" component="h3" gutterBottom align="center">
          {title}
        </Typography>
        
        {isLoading && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            評価を読み込み中...
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
        
        <List disablePadding>
          {evaluationData.map((evaluation) => (
            <ListItem key={evaluation.id} disableGutters>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                px: 1,
              }}>
                <Typography variant="body1">
                  {evaluation.companyName}
                </Typography>
                <Rating
                  name={`rating-${evaluation.id}`}
                  value={evaluation.rating}
                  max={maxRating}
                  precision={precision}
                  readOnly
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

// Copyright (c) 2025 nogi
// All rights reserved.
