import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { gameLogData, GameLogItem } from '../../dummy_data/chartData';

// アイコンのインポート
import CampaignIcon from '@mui/icons-material/Campaign';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import DiamondIcon from '@mui/icons-material/Diamond';
import InfoIcon from '@mui/icons-material/Info';

// APIレスポンスの型定義
interface ApiGameLogItem {
  date: string;
  icon: string;
  color: string;
  text: string;
}

interface ApiGameLogsResponse {
  logs: ApiGameLogItem[];
}

// アイコン文字列をReactElementに変換する関数
function getIconComponent(iconName: string): React.ComponentType {
  const iconMap: Record<string, React.ComponentType> = {
    campaign: CampaignIcon,
    military_tech: MilitaryTechIcon,
    trending_up: TrendingUpIcon,
    security: SecurityIcon,
    diamond: DiamondIcon,
    info: InfoIcon,
  };
  return iconMap[iconName] || InfoIcon;
}

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
  /** ユーザーID（APIからデータを取得する場合） */
  userId?: string;
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
  userId = "11111111-1111-1111-1111-111111111111", // デフォルトユーザーID
}: GameLogProps) {
  // Redux storeからサーバー設定を取得
  const { host, port } = useSelector((state: any) => state.server);
  
  // ベースURLを構築
  const baseUrl = React.useMemo(() => {
    return port ? `${host}:${port}` : host;
  }, [host, port]);
  
  // ステート管理
  const [gameLogsData, setGameLogsData] = React.useState<GameLogItem[]>(logs);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // APIからデータを取得する関数
  const fetchGameLogs = React.useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<ApiGameLogsResponse>(`${baseUrl}/charts/game_logs/${userId}`);
      if (response.data?.logs) {
        // APIデータをGameLogItem形式に変換
        const convertedLogs: GameLogItem[] = response.data.logs.map(apiLog => {
          const IconComponent = getIconComponent(apiLog.icon);
          return {
            date: apiLog.date,
            icon: <IconComponent />,
            color: apiLog.color,
            text: apiLog.text,
          };
        });
        setGameLogsData(convertedLogs);
      }
    } catch (err) {
      console.error('Failed to fetch game logs:', err);
      setError('ゲームログの取得に失敗しました');
      // エラー時はダミーデータを使用
      setGameLogsData(logs);
    } finally {
      setIsLoading(false);
    }
  }, [userId, logs, baseUrl]);

  // コンポーネントマウント時にデータを取得
  React.useEffect(() => {
    fetchGameLogs();
  }, [fetchGameLogs]);

  // maxItemsが指定されている場合は、その数だけ表示
  const displayLogs = maxItems ? gameLogsData.slice(0, maxItems) : gameLogsData;
  return (
    <Box sx={{ width: width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        sx={{ textAlign: titleAlign, width: '100%' }}
      >
        {title}
      </Typography>
      
      {isLoading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ログを読み込み中...
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
      
      <List sx={{ width: '100%', bgcolor: 'transparent' }}>
        {displayLogs.map((item, index) => (
          <Paper
            key={`log-${item.date}-${index}`}
            elevation={elevation}
            sx={{
              p: spacing,
              mb: spacing,
              borderRadius: borderRadius,
              mx: { xs: 0, sm: horizontalMargin },
              width: { xs: '100%', sm: `calc(100% - ${horizontalMargin * 2}px)` },
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
                {React.isValidElement(item.icon) 
                  ? React.cloneElement(
                      item.icon as React.ReactElement<import('@mui/material/SvgIcon').SvgIconProps>, 
                      { fontSize: "small" }
                    )
                  : <InfoIcon fontSize="small" />
                }
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

// Copyright (c) 2025 nogi
// All rights reserved.
