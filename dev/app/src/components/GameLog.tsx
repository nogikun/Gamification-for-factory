import * as React from 'react';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { gameLogData } from '../dataset/chartData'; // データファイルをインポート

/**
 * ゲームログを表示するコンポーネント
 */
export default function GameLog() {
  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
        ゲームログ
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'transparent' }}>
        {gameLogData.map((item, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: 2,
              mx: 2, // 左右に余白を追加
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                sx={{ minWidth: '35px', fontWeight: 'bold', color: 'text.secondary' }}
              >
                {item.date}
              </Typography>
              <Avatar sx={{ bgcolor: item.color, width: 32, height: 32 }}>
                {/* アイコンのサイズを調整 */}
                {React.cloneElement(item.icon as React.ReactElement<import('@mui/material/SvgIcon').SvgIconProps>, { fontSize: "small" })}
              </Avatar>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {item.text}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </List>
    </div>
  );
}