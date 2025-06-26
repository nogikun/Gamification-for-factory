import CampaignIcon from '@mui/icons-material/Campaign';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SecurityIcon from '@mui/icons-material/Security';
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ReactNode } from 'react';
// インターン参加数グラフのダミーデータ

export const dataset = [
  { month: '1月', internParticipants: 25 },
  { month: '2月', internParticipants: 30 },
  { month: '3月', internParticipants: 45 },
  { month: '4月', internParticipants: 38 },
  { month: '5月', internParticipants: 50 },
  { month: '6月', internParticipants: 65 },
  { month: '7月', internParticipants: 70 },
  { month: '8月', internParticipants: 60 },
  { month: '9月', internParticipants: 40 },
  { month: '10月', internParticipants: 35 },
  { month: '11月', internParticipants: 30 },
  { month: '12月', internParticipants: 28 },
];
export const valueFormatter = (value: number | null) => `${value}回`;

// ゲーム進捗グラフのダミーデータ ---
export const gameProgressData = {
  value: 100,
};


/**
 * ゲームログの各項目の型定義
 */
export interface GameLogItem {
  date: string;
  icon: ReactNode;
  color: string;
  text: string;
}
/**
 * ゲームログのデータ配列
 */
export const gameLogData: GameLogItem[] = [
  { date: '4/3', icon: <CampaignIcon />, color: '#ef5350', text: '新しいクエスト「森の探索」を開始！' },
  { date: '4/7', icon: <MilitaryTechIcon />, color: '#ff7043', text: 'サブミッション「隠しアイテム発見」達成！' },
  { date: '4/12', icon: <ArrowUpwardIcon />, color: '#66bb6a', text: 'レベルが12に上がった！' },
  { date: '4/17', icon: <SecurityIcon />, color: '#ab47bc', text: 'ボス「ダークゴーレム」を撃破！' },
  { date: '4/21', icon: <DiamondIcon />, color: '#29b6f6', text: 'レアアイテム「魔法のクリスタル」獲得' },
  { date: '4/25', icon: <FavoriteIcon />, color: '#ec407a', text: '仲間「リーナ」がパーティーに加入' },
  { date: '4/30', icon: <EmojiEventsIcon />, color: '#ffa726', text: 'エンディング到達！全クリア！' },
];