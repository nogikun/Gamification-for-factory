import * as React from 'react';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { gameLogData, GameLogItem } from '../../dataset/chartData';

/**
 * ゲームログの表示プロパティ
 */
export interface GameLogProps {
  /** ゲームログデータの配列 */
  logs?: GameLogItem[];
  /** セクションのタイトル */
  title?: string;
  /** 表示する最大アイテム数 */
  maxItems?: number;
  /** タイトルの配置 */
  titleAlign?: 'left' | 'center' | 'right';
  /** カードの影の深度 */
  elevation?: number;
  /** カードの角の丸み */
  borderRadius?: number;
  /** カード間の間隔 */
  spacing?: number;
  /** 左右の余白 */
  horizontalMargin?: number;
  /** アバターのサイズ */
  avatarSize?: number;
  /** 全体の幅設定 */
  width?: string | number;
}

/**
 * ゲームログを表示するコンポーネント
 */
export default function GameLog({
  logs = gameLogData,
  title = "ゲームログ",
  maxItems,
  titleAlign = 'center',
  elevation = 2,
  borderRadius = 2,
  spacing = 1.5,
  horizontalMargin = 2,
  avatarSize = 32,
  width = '100%',
}: GameLogProps) {
  // maxItemsが指定されている場合は、その数だけ表示
  const displayLogs = maxItems ? logs.slice(0, maxItems) : logs;
  return (
    <Box sx={{ width: width }}>
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        sx={{ textAlign: titleAlign }}
      >
        {title}
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'transparent' }}>
        {displayLogs.map((item, index) => (
          <Paper
            key={index}
            elevation={elevation}
            sx={{
              p: spacing,
              mb: spacing,
              borderRadius: borderRadius,
              mx: horizontalMargin,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                sx={{ minWidth: '35px', fontWeight: 'bold', color: 'text.secondary' }}
              >
                {item.date}
              </Typography>
              <Avatar sx={{ bgcolor: item.color, width: avatarSize, height: avatarSize }}>
                {React.cloneElement(
                  item.icon as React.ReactElement<import('@mui/material/SvgIcon').SvgIconProps>, 
                  { fontSize: "small" }
                )}
              </Avatar>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {item.text}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </List>
    </Box>
  );
}
