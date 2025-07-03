import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { companyEvaluations, CompanyEvaluationData } from '../../dataset/chartData';

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
}: CompanyEvaluationsProps) {
  return (
    <Box sx={{ p: padding }}>
      <Paper 
        variant={variant}
        elevation={variant === 'elevation' ? elevation : 0}
        sx={{ borderRadius: borderRadius, p: innerPadding }}
      >
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <List disablePadding>
          {evaluations.map((evaluation) => (
            <ListItem key={evaluation.id} disableGutters>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
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
