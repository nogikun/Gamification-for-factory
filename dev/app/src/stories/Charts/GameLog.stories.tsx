import type { Meta, StoryObj } from '@storybook/react';
import GameLog from './GameLog';
import { gameLogData } from '../../dummy_data/chartData';

const meta: Meta<typeof GameLog> = {
  title: 'Charts/GameLog',
  component: GameLog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ゲームログの表示コンポーネント。ユーザーのゲーム活動履歴をタイムライン形式で表示します。',
      },
    },
  },
  argTypes: {
    logs: {
      description: 'ゲームログデータの配列',
      control: { type: 'object' },
    },
    title: {
      description: 'セクションのタイトル',
      control: { type: 'text' },
    },
    maxItems: {
      description: '表示する最大アイテム数',
      control: { type: 'number', min: 1, max: 20 },
    },
    titleAlign: {
      description: 'タイトルの配置',
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    elevation: {
      description: 'カードの影の深度',
      control: { type: 'number', min: 0, max: 24 },
    },
    borderRadius: {
      description: 'カードの角の丸み',
      control: { type: 'number', min: 0, max: 20 },
    },
    spacing: {
      description: 'カード間の間隔',
      control: { type: 'number', min: 0, max: 5 },
    },
    horizontalMargin: {
      description: '左右の余白',
      control: { type: 'number', min: 0, max: 50 },
    },
    avatarSize: {
      description: 'アバターのサイズ',
      control: { type: 'number', min: 20, max: 80 },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    logs: gameLogData,
    title: 'ゲームログ',
    maxItems: 10,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 40,
  },
};

// カスタムデータストーリー
export const WithCustomData: Story = {
  args: {
    logs: [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        action: 'ログイン',
        description: 'ゲームにログインしました',
        color: '#4CAF50',
        user: 'プレイヤー1',
        points: 0,
      },
      {
        id: '2',
        timestamp: '2024-01-15T10:35:00Z',
        action: 'クエストクリア',
        description: 'チュートリアルクエストをクリアしました',
        color: '#2196F3',
        user: 'プレイヤー1',
        points: 100,
      },
      {
        id: '3',
        timestamp: '2024-01-15T10:45:00Z',
        action: 'レベルアップ',
        description: 'レベル2に上がりました',
        color: '#FF9800',
        user: 'プレイヤー1',
        points: 50,
      },
      {
        id: '4',
        timestamp: '2024-01-15T11:00:00Z',
        action: 'アイテム取得',
        description: 'レア武器「炎の剣」を取得しました',
        color: '#9C27B0',
        user: 'プレイヤー1',
        points: 200,
      },
    ],
    title: 'カスタムゲームログ',
    maxItems: 5,
    titleAlign: 'center',
    elevation: 4,
    borderRadius: 12,
    spacing: 3,
    horizontalMargin: 20,
    avatarSize: 50,
  },
};

// コンパクト表示
export const Compact: Story = {
  args: {
    logs: gameLogData.slice(0, 5),
    title: 'コンパクトログ',
    maxItems: 5,
    titleAlign: 'left',
    elevation: 1,
    borderRadius: 4,
    spacing: 1,
    horizontalMargin: 8,
    avatarSize: 32,
  },
};

// 最新のアクティビティ
export const RecentActivity: Story = {
  args: {
    logs: gameLogData.slice(0, 3),
    title: '最新のアクティビティ',
    maxItems: 3,
    titleAlign: 'center',
    elevation: 3,
    borderRadius: 10,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 45,
  },
};

// ログなしの場合
export const NoLogs: Story = {
  args: {
    logs: [],
    title: 'アクティビティなし',
    maxItems: 10,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 2,
    horizontalMargin: 16,
    avatarSize: 40,
  },
};

// 大きなアバター
export const LargeAvatars: Story = {
  args: {
    logs: gameLogData.slice(0, 4),
    title: '大型アバター表示',
    maxItems: 4,
    titleAlign: 'left',
    elevation: 2,
    borderRadius: 8,
    spacing: 3,
    horizontalMargin: 24,
    avatarSize: 60,
  },
};
