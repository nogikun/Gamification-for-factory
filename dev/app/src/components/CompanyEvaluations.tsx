import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { companyEvaluations } from '../dataset/chartData'; // 作成したデータをインポート

/**
 * 企業からの評価リストを表示するコンポーネント
 */
export default function CompanyEvaluations() {
  return (
    <Box sx={{ p: 2 }}> {/* 全体の余白を設定 */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}> {/* p:2で内側にパディング */}
        <Typography variant="h6" component="h3" gutterBottom>
          企業からの評価
        </Typography>
        <List disablePadding>
          {companyEvaluations.map((evaluation) => (
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
                  precision={0.5} // 0.5段階評価を許可
                  readOnly // ユーザーが変更できないように読み取り専用にする
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}